from rest_framework import serializers
from .models import Ticket, TicketActivity


class TicketActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketActivity
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'ticket']


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['id', 'created']
