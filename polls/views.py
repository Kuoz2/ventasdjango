import json
from datetime import date, datetime, timedelta

from django.db.models import Sum
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import categorias, productos, ventas
from .tables import tableListaVentas, tableProducto, tableVentasProductos


# Create your views here.
def index(response):
    return HttpResponse("hellow, esta es la vista de polls")

def inventario(request):
    
    if request.method == 'GET':
        Productos = productos.objects.all().order_by('-id')
        Categorias = categorias.objects.all()
        #p=Paginator(productos.objects.all(),10)
        #page=request.GET.get('page')
        #vanues = p.get_page(page)
        buscarcodigo = request.GET.get('pcodigo')
        if buscarcodigo:
            Productos = Productos.filter(pcodigo=buscarcodigo)

        table = tableProducto(Productos)
        #table.paginate(page=request.GET.get("page",1), per_page=8 )
        htm = render(request, "ListaProductos.html", {"table":table, "Categorias":Categorias})
        
    return HttpResponse(htm)
    #table_data = table.data
    #serialized_data = serializers.serialize('json', table_data)

    #return render(request,"ListaProductos.html", {"Productos": Productos, "Categorias":Categorias})

    #return JsonResponse(serialized_data, safe=False)


def guardarProducto(request):
    EsteDia=date.today()    
    pcodigo=request.POST['pcodigo']
    nombre=request.POST['nombre']
    precio=request.POST['precio']
    precioiva=request.POST['precioiva']
    cantidad=request.POST['cantidad']
    fechavenci=request.POST['fechavenci']
    ProductosIngresados= productos.objects.create(pcodigo=pcodigo,
                                                  nombre=nombre,
                                                  precio=precio, 
                                                  precioiva=precioiva,
                                                  fechain=EsteDia,
                                                  cantidad=cantidad,
                                                  categoryid_id=1,
                                                  fechavenci=fechavenci
                                                  )
    ProductosIngresados.save()
    return redirect('/polls/inventario')
    
def editarProducto(request, codigo):
    product=productos.objects.get(id=codigo)
    return render(request, "editarProducto.html", {"codigo":product})

def editarProductos(request):
    EsteDia=date.today()
    id=request.POST['id']    
    pcodigo=request.POST['pcodigo']
    nombre=request.POST['nombre']
    precio=request.POST['precio']
    precioiva=request.POST['precioiva']
    cantidad=request.POST['cantidad']
    categoryid=request.POST['categoryid']
    fechavenci=request.POST['fechavenci']

    producto=productos.objects.get(id=id)
    producto.pcodigo=pcodigo
    producto.nombre=nombre
    producto.precio=precio
    producto.precioiva=precioiva
    producto.fechain=EsteDia
    producto.cantidad=cantidad
    producto.categoryid_id=categoryid
    producto.fechavenci=fechavenci
    producto.save()
    return redirect('/polls/inventario')

def venta(request):
    Productos = productos.objects.all().order_by('-id')
    table = tableVentasProductos(Productos)

    html = render(request, "ventas.html", {"table":table})
    return HttpResponse(html)

@require_http_methods(['PUT'])
@csrf_exempt
def editarVentaProducto(request):
 if(request.method == 'PUT'):
    try:
        data = json.loads(request.body)
        datosIngresados = data['datosIngresados']
        for Productos in datosIngresados:
            id=Productos['id']                        
            cantidad=Productos['cantidad']
        Productos=productos.objects.get(id=id)
        Productos.pcodigo=Productos.pcodigo
        Productos.nombre=Productos.nombre
        Productos.precio=Productos.precio
        Productos.precioiva=Productos.precioiva
        Productos.cantidad=cantidad
        Productos.categoryid=Productos.categoryid
        Productos.fechavenci=Productos.fechavenci
        Productos.save()
        return JsonResponse({'success':'Informacion guardada'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 else:    
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
            
@csrf_exempt
def guardarVenta(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            productos = data.get('productos',[])
            for producto in productos:
                venta = ventas(
                    preciov=producto['preciov'],
                    cantidadv=producto['cantidadv'],
                    fechav=producto['fechav'],
                    metodov=producto['metodov'],
                    productoin=producto['productoin'],
                    productoid_id=producto['productoid'],
                )
                venta.save()
          
            return JsonResponse({'success':'200'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


def historialRegistros(request):
    if request.method == 'GET':
        infoventa = ventas.objects.all()
        tables = tableListaVentas(infoventa)

        # Fecha de hoy
        hoy = datetime.today().strftime('%d/%m/%Y')
        hoy_date = datetime.strptime(hoy, '%d/%m/%Y').date()
        
        # Ventas de hoy
        ventas_hoy = ventas.objects.filter(fechav=hoy)
        total_ventas_hoy = ventas_hoy.aggregate(total=Sum('preciov'))['total'] or 0
        
        # Ventas de la semana (desde el lunes de esta semana hasta hoy)
        inicio_semana = hoy_date - timedelta(days=hoy_date.weekday())
        inicio_semana_str = inicio_semana.strftime('%d/%m/%Y')
        ventas_semana = ventas.objects.filter(fechav__range=[inicio_semana_str, hoy])
        total_ventas_semana = ventas_semana.aggregate(total=Sum('preciov'))['total'] or 0
        
        # Ventas del mes (desde el primer día del mes hasta hoy)
        inicio_mes = hoy_date.replace(day=1)
        inicio_mes_str = inicio_mes.strftime('%d/%m/%Y')
        ventas_mes = ventas.objects.filter(fechav__range=[inicio_mes_str, hoy])
        total_ventas_mes = ventas_mes.aggregate(total=Sum('preciov'))['total'] or 0

        # Datos para pasar a la plantilla
        data = {
            'ventas_hoy': total_ventas_hoy,
            'ventas_semana': total_ventas_semana,
            'ventas_mes': total_ventas_mes,
            'ventas': tables
        }
        # tables = tableListaVentas(Ventas)
        return  render(request, "historial.html", data)
    #return JsonResponse(data, safe=False) 
