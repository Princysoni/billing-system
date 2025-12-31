from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction
from .models import Plan, Subscription, Invoice, Payment
from .serializers import PlanSerializer, SubscriptionSerializer, InvoiceSerializer, PaymentSerializer
from .permissions import IsAdmin, IsCustomer

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all().order_by('-created_at')
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.select_related('plan', 'customer').all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    def get_queryset(self):
        # Customers can only see their subscriptions
        return Subscription.objects.filter(customer=self.request.user).select_related('plan')

    def perform_create(self, serializer):
        # Customer can subscribe to one active plan only
        plan = serializer.validated_data['plan']
        if not plan.active:
            raise ValueError("Cannot subscribe to inactive plan.")
        # Ensure no existing active subscription
        exists = Subscription.objects.filter(customer=self.request.user, state=Subscription.State.ACTIVE).exists()
        if exists:
            raise ValueError("You already have an active subscription.")
        serializer.save(customer=self.request.user, state=Subscription.State.ACTIVE)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        sub = self.get_object()
        if sub.state == Subscription.State.CANCELLED:
            return Response({'detail': 'Already cancelled'}, status=status.HTTP_400_BAD_REQUEST)
        sub.state = Subscription.State.CANCELLED
        sub.cancelled_at = timezone.now()
        sub.save()
        return Response(SubscriptionSerializer(sub).data)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.select_related('plan', 'customer').all().order_by('-created_at')
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_admin', lambda: False)():
            return self.queryset
        return self.queryset.filter(customer=user)

    def perform_create(self, serializer):
        # Admin generates invoice manually
        serializer.save()

class PaymentViewSet(viewsets.GenericViewSet):
    queryset = Payment.objects.select_related('invoice')
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def pay(self, request):
        # Mock payment: mark invoice as paid, store payment record
        invoice_id = request.data.get('invoice_id')
        reference = request.data.get('reference', '')
        method = request.data.get('method', 'MOCK')

        try:
            invoice = Invoice.objects.select_for_update().get(id=invoice_id, customer=request.user)
        except Invoice.DoesNotExist:
            return Response({'detail': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)

        if invoice.status == Invoice.Status.PAID:
            return Response({'detail': 'Invoice already paid'}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(
            invoice=invoice, amount=invoice.amount, method=method, reference=reference
        )
        invoice.status = Invoice.Status.PAID
        invoice.save()

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)