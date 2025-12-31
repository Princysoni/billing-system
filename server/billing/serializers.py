from rest_framework import serializers
from .models import Plan, Subscription, Invoice, Payment

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'price', 'currency', 'active', 'created_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'customer', 'plan', 'state', 'started_at', 'cancelled_at']
        read_only_fields = ['customer', 'started_at', 'cancelled_at']

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'number', 'customer', 'plan', 'amount', 'currency', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'invoice', 'paid_at', 'method', 'reference', 'amount']
        read_only_fields = ['paid_at']