from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.LeadViewSet, basename='leads')
activity_list = views.LeadActivityViewSet.as_view({
    'get': 'list',
    'post': 'create',
})
activity_detail = views.LeadActivityViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})
activity_toggle = views.LeadActivityViewSet.as_view({
    'patch': 'toggle',
})

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('<int:lead_id>/activities/', activity_list, name='lead-activities'),
    path('<int:lead_id>/activities/<int:pk>/', activity_detail, name='lead-activity-detail'),
    path('<int:lead_id>/activities/<int:pk>/toggle/', activity_toggle, name='lead-activity-toggle'),
    path('', include(router.urls)),
]
