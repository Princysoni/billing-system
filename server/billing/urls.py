from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlanViewSet, SubscriptionViewSet, InvoiceViewSet, PaymentViewSet

router = DefaultRouter()
router.register('plans', PlanViewSet, basename='plans')
router.register('subscriptions', SubscriptionViewSet, basename='subscriptions')
router.register('invoices', InvoiceViewSet, basename='invoices')
router.register('payments', PaymentViewSet, basename='payments')

urlpatterns = [
    path('', include(router.urls)),
]