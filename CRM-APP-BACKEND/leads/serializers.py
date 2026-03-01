from rest_framework import serializers
from .models import Lead, LeadActivity


class LeadActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadActivity
        fields = '__all__'
        read_only_fields = ['id', 'lead', 'created_at']


class LeadSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()

    class Meta:
        model = Lead
        fields = ['id', 'name', 'first_name', 'last_name', 'email', 'phone',
                  'status', 'title', 'owner', 'role', 'created']
        read_only_fields = ['id', 'created']
