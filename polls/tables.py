import django_tables2 as tables
from .models import productos
class tableProducto(tables.Table):
    editar = tables.TemplateColumn('<a href="{% url "editarProducto" record.id %}" class="btn btn-primary">Editar</a>')

    class Meta:
        model= productos
        fields=('pcodigo','nombre','precio','cantidad')
        attrs = {'class':'table table-striped table-container','id':'dataTable'}
class tableVentasProductos(tables.Table):

    class Meta:
        model= productos
        fields=('pcodigo','nombre','precio','cantidad','id')
        attrs = {'class':'table table-striped ','id':'dataTable'}
