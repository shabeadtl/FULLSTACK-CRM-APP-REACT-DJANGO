"""
Main URL configuration for crm_backend project.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/leads/', include('leads.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/tickets/', include('tickets.urls')),
    path('api/deals/', include('deals.urls')),
]
