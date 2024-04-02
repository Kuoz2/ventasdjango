from django.contrib import admin
from .models import ventas
from .models import productos
from .models import categorias
# Register your models here.
admin.site.register(categorias)
admin.site.register(productos)
admin.site.register(ventas)

