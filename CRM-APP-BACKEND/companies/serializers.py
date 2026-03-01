from rest_framework import serializers
from .models import Company, CompanyActivity


class CompanyActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyActivity
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'company']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
