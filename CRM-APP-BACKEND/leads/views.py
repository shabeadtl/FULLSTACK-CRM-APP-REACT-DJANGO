from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count, Sum, Q
from django.utils import timezone
from .models import Lead, LeadActivity
from .serializers import LeadSerializer, LeadActivitySerializer
from deals.models import Deal


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [AllowAny]


class LeadActivityViewSet(viewsets.ModelViewSet):
    serializer_class = LeadActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        lead_id = self.kwargs.get('lead_id')
        if lead_id:
            return LeadActivity.objects.filter(lead_id=lead_id)
        return LeadActivity.objects.all()

    def perform_create(self, serializer):
        lead_id = self.kwargs.get('lead_id')
        serializer.save(lead_id=lead_id)

    @action(detail=True, methods=['patch'])
    def toggle(self, request, lead_id=None, pk=None):
        activity = self.get_object()
        if activity.type == 'task':
            activity.completed = not activity.completed
            activity.save()
        return Response(LeadActivitySerializer(activity).data)


@api_view(['GET'])
def dashboard(request):
    total_leads = Lead.objects.count()
    active_deals = Deal.objects.exclude(stage__in=['Closed Won', 'Closed Lost']).count()
    closed_deals = Deal.objects.filter(stage='Closed Won').count()
    monthly_revenue = Deal.objects.filter(stage='Closed Won').aggregate(
        total=Sum('amount')
    )['total'] or 0
    total_deals = Deal.objects.count()
    conversion_stages = [
        'Appointment Scheduled', 'Qualified to Buy',
        'Presentation Scheduled', 'Decision Maker Bought In',
        'Contract Sent', 'Closed Won', 'Closed Lost',
    ]
    conversion = []
    for stage in conversion_stages:
        count = Deal.objects.filter(stage=stage).count()
        pct = round((count / total_deals) * 100) if total_deals > 0 else 0
        conversion.append({'label': stage, 'value': pct})
    current_year = timezone.now().year
    monthly_sales = [0] * 12
    deals_this_year = Deal.objects.filter(close_date__year=current_year)
    for deal in deals_this_year:
        month_idx = deal.close_date.month - 1
        monthly_sales[month_idx] += float(deal.amount)
    yearly_sales = []
    for yr in range(current_year - 4, current_year + 1):
        yr_total = Deal.objects.filter(close_date__year=yr).aggregate(
            total=Sum('amount')
        )['total'] or 0
        yearly_sales.append(float(yr_total))
    owners = Deal.objects.exclude(owner='').values_list('owner', flat=True).distinct()
    team = []
    for owner_name in owners:
        owner_deals = Deal.objects.filter(owner=owner_name)
        active = owner_deals.exclude(stage__in=['Closed Won', 'Closed Lost']).count()
        closed = owner_deals.filter(stage='Closed Won').count()
        revenue = owner_deals.filter(stage='Closed Won').aggregate(
            total=Sum('amount')
        )['total'] or 0
        team.append({
            'name': owner_name,
            'active': active,
            'closed': closed,
            'revenue': float(revenue),
            'trend': f'+{round((closed / (active + closed)) * 100)}%' if (active + closed) > 0 else '+0%',
        })

    return Response({
        'stats': {
            'totalLeads': total_leads,
            'activeDeals': active_deals,
            'closedDeals': closed_deals,
            'monthlyRevenue': float(monthly_revenue),
        },
        'conversion': conversion,
        'sales': {
            'monthly': monthly_sales,
            'yearly': yearly_sales,
        },
        'team': team,
    })
