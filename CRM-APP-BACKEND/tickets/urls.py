from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.TicketViewSet, basename='tickets')
activity_list = views.TicketActivityViewSet.as_view({
    'get': 'list',
    'post': 'create',
})
activity_detail = views.TicketActivityViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy',
})
activity_toggle = views.TicketActivityViewSet.as_view({
    'patch': 'toggle',
})

urlpatterns = [
    path('<int:ticket_id>/activities/', activity_list, name='ticket-activities'),
    path('<int:ticket_id>/activities/<int:pk>/', activity_detail, name='ticket-activity-detail'),
    path('<int:ticket_id>/activities/<int:pk>/toggle/', activity_toggle, name='ticket-activity-toggle'),
    path('', include(router.urls)),
]
