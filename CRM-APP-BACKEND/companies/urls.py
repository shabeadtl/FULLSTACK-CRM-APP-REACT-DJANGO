from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.CompanyViewSet, basename='companies')
activity_list = views.CompanyActivityViewSet.as_view({
    'get': 'list',
    'post': 'create',
})
activity_detail = views.CompanyActivityViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})
activity_toggle = views.CompanyActivityViewSet.as_view({
    'patch': 'toggle',
})

urlpatterns = [
    path('<int:company_id>/activities/', activity_list, name='company-activities'),
    path('<int:company_id>/activities/<int:pk>/', activity_detail, name='company-activity-detail'),
    path('<int:company_id>/activities/<int:pk>/toggle/', activity_toggle, name='company-activity-toggle'),
    path('', include(router.urls)),
]
