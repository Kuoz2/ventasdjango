from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("inventario", views.inventario, name="inventario"),
    path('inventario/guardarProducto/', views.guardarProducto, name="guardarProducto"),
    path('inventario/editarProductos/', views.editarProductos, name="editarProductos"),
    path('editarProducto/<codigo>', views.editarProducto, name="editarProducto"),
    path('inventario/ventas', views.venta, name="ventas"),
    path('inventario/guardarVenta', views.guardarVenta, name="guardarVentas"),
    path('inventario/editarVentaProducto', views.editarVentaProducto, name="editarVentaProducto"),


]