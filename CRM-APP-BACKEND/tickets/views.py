from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Ticket, TicketActivity
from .serializers import TicketSerializer, TicketActivitySerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [AllowAny]


class TicketActivityViewSet(viewsets.ModelViewSet):
    serializer_class = TicketActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        ticket_id = self.kwargs.get('ticket_id')
        if ticket_id:
            return TicketActivity.objects.filter(ticket_id=ticket_id)
        return TicketActivity.objects.all()

    def perform_create(self, serializer):
        ticket_id = self.kwargs.get('ticket_id')
        serializer.save(ticket_id=ticket_id)

    @action(detail=True, methods=['patch'])
    def toggle(self, request, ticket_id=None, pk=None):
        activity = self.get_object()
        if activity.type == 'task':
            activity.completed = not activity.completed
            activity.save()
        return Response(TicketActivitySerializer(activity).data)
