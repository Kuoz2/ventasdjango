import django_filters
from .models import productos

class buscarProducto(django_filters.FilterSet):
    #codigoProduct = django_filters.CharFilter(field_name='pcodigo', label='Codigo del producto')
    pcodigo = django_filters.CharFilter(lookup_expr='icontains')
    class Meta:
        model=productos
        fields=['pcodigo']