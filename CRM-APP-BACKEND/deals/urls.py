from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.DealViewSet, basename='deals')
activity_list = views.DealActivityViewSet.as_view({
    'get': 'list',
    'post': 'create',
})
activity_detail = views.DealActivityViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})
activity_toggle = views.DealActivityViewSet.as_view({
    'patch': 'toggle',
})

urlpatterns = [
    path('<int:deal_id>/activities/', activity_list, name='deal-activities'),
    path('<int:deal_id>/activities/<int:pk>/', activity_detail, name='deal-activity-detail'),
    path('<int:deal_id>/activities/<int:pk>/toggle/', activity_toggle, name='deal-activity-toggle'),
    path('', include(router.urls)),
]
