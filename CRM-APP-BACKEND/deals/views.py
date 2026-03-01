from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Deal, DealActivity
from .serializers import DealSerializer, DealActivitySerializer


class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer
    permission_classes = [AllowAny]


class DealActivityViewSet(viewsets.ModelViewSet):
    serializer_class = DealActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        deal_id = self.kwargs.get('deal_id')
        if deal_id:
            return DealActivity.objects.filter(deal_id=deal_id)
        return DealActivity.objects.all()

    def perform_create(self, serializer):
        deal_id = self.kwargs.get('deal_id')
        serializer.save(deal_id=deal_id)

    @action(detail=True, methods=['patch'])
    def toggle(self, request, deal_id=None, pk=None):
        activity = self.get_object()
        if activity.type == 'task':
            activity.completed = not activity.completed
            activity.save()
        return Response(DealActivitySerializer(activity).data)
