from rest_framework import serializers
from .models import Deal, DealActivity


class DealActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DealActivity
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'deal']


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = '__all__'
        read_only_fields = ['id', 'created']
