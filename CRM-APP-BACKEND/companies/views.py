from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Company, CompanyActivity
from .serializers import CompanySerializer, CompanyActivitySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query.strip():
            companies = Company.objects.all()
        else:
            companies = Company.objects.filter(
                Q(name__icontains=query) |
                Q(industry__icontains=query) |
                Q(contact__icontains=query)
            )
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)


class CompanyActivityViewSet(viewsets.ModelViewSet):
    serializer_class = CompanyActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        company_id = self.kwargs.get('company_id')
        if company_id:
            return CompanyActivity.objects.filter(company_id=company_id)
        return CompanyActivity.objects.all()

    def perform_create(self, serializer):
        company_id = self.kwargs.get('company_id')
        serializer.save(company_id=company_id)

    @action(detail=True, methods=['patch'])
    def toggle(self, request, company_id=None, pk=None):
        activity = self.get_object()
        if activity.type == 'task':
            activity.completed = not activity.completed
            activity.save()
        return Response(CompanyActivitySerializer(activity).data)
