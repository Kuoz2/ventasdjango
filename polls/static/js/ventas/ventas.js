  var datosIngresados = [];
    var numerodeFila=0;
    var TotalObtenido=0;
    var descontar = 0
    document.addEventListener('DOMContentLoaded',function() {

        document.getElementById('spinner-overlay').style.display = 'block';
        console.log("hola")
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                var searchValue = $('#dt-search-0').val().trim(); // Supongamos que tienes un input con id 'mySearchInput' para ingresar el código
                var codigo = data[0]; // Supongamos que la columna del código es la primera (índice 0)
                    return codigo === searchValue;               
            }
        );
    var table = $('#dataTable').DataTable({
            "paging":false,
            "lengthMenu": [[], []],
            "defaultContent":"<button>Editar</button>",                  
            "language": {
                "lengthMenu": "",
                "zeroRecords": "No se encontraron registros",
                "info": "",
                "infoEmpty": "",
                "infoFiltered": "",
                "search": "Buscar Por código:",
                "paginate": {
                    "first": "",
                    "last": "",
                    "next": "",
                    "previous": ""
                }
            }
           
        })
        $('#dt-search-0').on('keyup', function() {
            table.draw(); // Vuelve a dibujar la tabla con el filtro aplicado
        });
        $('#dt-search-0').on('input', function() {
            // Verificar si tabla es una instancia válida de DataTable
            if ($.fn.DataTable.isDataTable('#dataTable')) {
                // Obtener el valor del input
                var texto = $(this).val().trim();
                console.log('Texto ingresado:', texto);
    
                // Filtrar la tabla
                table.search(texto).draw();
            } else {
                console.log('Error: DataTables no está inicializado correctamente.');
            }
       
        });
        const botonAgregar = document.querySelectorAll('.agregar');
        const inputProducto = document.getElementById('dt-search-0');
        if(inputProducto){
        let temporizador;
        inputProducto.addEventListener('input', function(){
            clearTimeout(temporizador);

                temporizador = setTimeout(function(){
                const texto = inputProducto.value.trim();
                console.log(texto); // Corrección del nombre de la función
                const tabla = $('#dataTable').DataTable();
                const fila = tabla.rows().nodes().toArray().find(row => {
                    const datosFila = tabla.row(row).data(); // Obtener los datos de la fila usando DataTables
                    return datosFila[0] === texto; // Comparar con el primer dato de la fila (pcodigo)
                });

                if(fila){
                    const datosFila = tabla.row(fila).data(); // Obtener los datos de la fila usando DataTables
                    const pcodigo = datosFila[0]; // Primer columna
                    const nombre = datosFila[1]; // Segunda columna
                    const precio = datosFila[2]; // Tercera columna
                    const cantidad = datosFila[3]; // Cuarta columna
                    const id = datosFila[4] // Quinta columna
                    console.log('cantidad entrange',cantidad)
                    if(cantidad === '0'){alert("La cantidad esta en 0 no se puede agregar este producto"); return;}
                    datosIngresados.push({pcodigo:pcodigo, nombre:nombre,precio:precio,cantidad:cantidad,id:id})
                    agregar(pcodigo,nombre,precio,cantidad,id)
                    inputProducto.value = "";
                }

            },500)

        })
    }else{
        console.log('el dom no se a')
    }
      /*  botonAgregar.forEach(boton => {
            boton.addEventListener('click',function(){
                const fila = this.closest('tr'); // Obtener la fila actual
                const tabla = $('#dataTable').DataTable();
                const datosFila = tabla.row(fila).data(); // Obtener los datos de la fila usando DataTables

                const pcodigo = datosFila[0]; // Primer columna
                const nombre = datosFila[1]; // Segunda columna
                const precio = datosFila[2]; // Tercera columna
                const cantidad = datosFila[3]; // Cuarta columna
                const id = datosFila[4] // Quinta columna
                datosIngresados.push({pcodigo:pcodigo, nombre:nombre,precio:precio,cantidad:cantidad,id:id})
                console.log(datosIngresados)
                agregar(pcodigo,nombre,precio,cantidad,id)
            })
        })*/
  
      })
      window.addEventListener('load', function(){
    
        document.getElementById('spinner-overlay').style.display = 'none';
      })
    function agregar(pcodigo,nombre, precio,cantidad,id){
        const carritoElement = document.getElementById('TableVentas');
        const totalElement = document.getElementById('Total');
        
        // Verificar si ya existen elementos en el carrito
        const existeCarrito = carritoElement.querySelector('table');
        
        // Crear una nueva tabla si no existe carrito previo
        if (!existeCarrito) {
            // Crear una nueva tabla
            const tabla = document.createElement('table');
            tabla.classList.add('table', 'table-striped');
        
            // Crear el encabezado de la tabla
            const thead = document.createElement('thead');
            const headRow = document.createElement('tr');
            const headers = ['Código', 'Nombre', 'Precio', 'Cantidad', 'Acción']; // Encabezados de la tabla
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headRow.appendChild(th);
            });
            thead.appendChild(headRow);
            tabla.appendChild(thead);
        
            // Agregar la tabla al contenedor del carrito de compras
            carritoElement.appendChild(tabla);
        }
        
        // Verificar si ya existe el cuerpo de la tabla
        let tbody = carritoElement.querySelector('tbody');
        
        // Crear el cuerpo de la tabla si no existe
        if (!tbody) {
            tbody = document.createElement('tbody');
            carritoElement.querySelector('table').appendChild(tbody);
        }
        
        // Crear una fila para el nuevo producto
        const row = document.createElement('tr');
        
        // Crear celdas para cada atributo del producto
        const pcodigoCell = document.createElement('td');
        pcodigoCell.textContent = pcodigo;
        
        const nombreCell = document.createElement('td');
        nombreCell.textContent = nombre;
        
        const precioCell = document.createElement('td');
        precioCell.textContent = precio;
        
        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = cantidad;
        
        // Crear una celda para el botón de eliminación
        const eliminarCell = document.createElement('td');
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.classList.add('btn', 'btn-danger');
        eliminarBtn.addEventListener('click', function() {
            // Eliminar la fila cuando se hace clic en el botón de eliminar
            const filaActual = eliminarBtn.closest('tr');
            const precio = parseInt(filaActual.querySelector('td:nth-child(3)').textContent);
            const cantidad = parseInt(filaActual.querySelector('td:nth-child(4)').textContent);
            const indiceFila = obtenerIndiceFila(filaActual);
        
            // Ahora puedes usar el índiceFila según sea necesario
            console.log('La fila actual está en la posición:', indiceFila);
            datosIngresados.splice(indiceFila, 1); // Calcular el total actual restando el precio de la fila eliminada
            let totalActual = parseInt(totalElement.textContent.replace(/\$/g, '').replace(/^Total:\s*/, ''));
            totalActual -= precio;
            totalElement.textContent = 'Total: $' + totalActual;
        
            // Eliminar la fila cuando se hace clic en el botón de eliminar
            filaActual.remove();
            return totalActual;
        });
        
        function obtenerIndiceFila(fila) {
            // Obtener el tbody al que pertenece la fila
            const tbody = fila.closest('tbody');
        
            // Obtener todas las filas del tbody
            const filas = Array.from(tbody.querySelectorAll('tr'));
        
            // Iterar sobre las filas previas para contar la posición de la fila actual
            let indice = 0;
            for (const filaIterada of filas) {
                if (filaIterada === fila) {
                    break; // Detener la iteración cuando se encuentra la fila actual
                }
                indice++;
            }
        
            return indice !== -1 ? indice : null;
        }
        eliminarCell.appendChild(eliminarBtn);
        
        // Agregar las celdas a la fila
        row.appendChild(pcodigoCell);
        row.appendChild(nombreCell);
        row.appendChild(precioCell);
        row.appendChild(cantidadCell);
        row.appendChild(eliminarCell);
        
        // Agregar la fila al cuerpo de la tabla
        tbody.appendChild(row);
        
        // Obtener la tabla existente o crear una nueva si no existe
        const tablaExistente = carritoElement.querySelector('table') || document.createElement('table');
        tablaExistente.classList.add('table', 'table-striped');
        
        // Agregar el cuerpo de la tabla a la tabla existente
        tablaExistente.appendChild(tbody);
        
        // Agregar la tabla al contenedor del carrito de compras
        carritoElement.appendChild(tablaExistente);
        
        // Calcular y mostrar el total
        mostrarTotal(carritoElement);
        
        function mostrarTotal(element) {
            let total = 0;
            const filas = element.querySelectorAll('tbody tr');
            filas.forEach(fila => {
                const precio = parseInt(fila.querySelector('td:nth-child(3)').textContent);
                const cantidad = parseInt(fila.querySelector('td:nth-child(4)').textContent);
                total += precio;
            });
            totalElement.textContent = 'Total: $' + total;
        }

}//Termino de agregar al carrito

document.addEventListener('DOMContentLoaded', function(){
    btnGUardar = document.getElementById('guardarVenta');
  

    btnGUardar.addEventListener('click', function() {
       
        const countById = {};
        const sumaPreciosById = {};
        let obtenercantidad = 0;
        const restarcantidad = {};
        if (event.target && event.target.id === 'guardarVenta') {
            if (datosIngresados.length !== 0) {
                datosIngresados.forEach((res) =>{
                    const cantidad= res.id;
                    countById[cantidad] = (countById[cantidad] || 0) +1 
                    obtenercantidad = res.cantidad
                });
                const datosIngresadosCopiados = JSON.parse(JSON.stringify(datosIngresados));

                datosIngresados.forEach((res, index)=>{
                    const repeticiones = countById[res.id];
    
                    // Restar la cantidad total de productos repetidos a la cantidad del producto
                    datosIngresados[index].cantidad -= repeticiones;

                })
                      
                const datosActualizados = {
                    datosIngresados: datosIngresados
                }      
                console.log('datos ingresad', datosActualizados) 
                const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
   
                $.ajax({
                    url: '../inventario/editarVentaProducto',
                    method: 'PUT',
                    type:'PUT',
                    headers: {
                        "X-CSRFToken": csrfToken // Establecer el token CSRF en el encabezado
                    },
                    xhrFields: {
                        withCredentials: true // Enviar las credenciales para permitir solicitudes entre dominios
                    },
                    data: JSON.stringify(datosActualizados),
                    contentType:'application/json',
                    dataType: 'json',
                    success: function (response){
                        if(response.success == 'Informacion guardada'){
                            location.reload();
                        }else{console.error('Error:', response.error);}
                     },
                    error: function(xhr, errmsg, err){
                        console.log('estatus del guardado',xhr.status + ':' + xhr.responseText);
                    }
                })
                datosIngresados.forEach(producto => {
                    const id = producto.id;
                    const precio = parseInt(producto.precio);
                    sumaPreciosById[id] = (sumaPreciosById[id] || 0) + precio;
                });
            }

            Object.keys(countById).forEach( async id => {
                const fechaActual = new Date();
                const año = fechaActual.getFullYear();
                const mes = fechaActual.getMonth() + 1;
                const dia = fechaActual.getDate();
                const hoy = dia+ '/' + mes + '/' + año
                let cantidad=countById[id];
                let preciov = sumaPreciosById[id];
                let fechav=hoy.toString();
                let metodov = document.getElementById('metodoPago').value;
                let productoin=0;
                const productosJSON = [];
                //Se crea un json para poder guardar el producto
                const Productos= {
                    preciov:preciov,
                    cantidadv:cantidad,
                    fechav:fechav,
                    metodov:metodov,
                    productoin:0,
                    productoid:id
                }
                const actProducto={

                }
                productosJSON.push(Productos)
                const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

                console.log('Productos ingresados', productosJSON);
                
                await $.ajax({
                    url: "../../inventario/inventario/guardarVenta",
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ productos: productosJSON }), // Enviar los productosJSON como datos JSON
                    headers: {
                        "X-CSRFToken": csrfToken // Establecer el token CSRF en el encabezado
                    },
                    xhrFields: {
                        withCredentials: true // Enviar las credenciales para permitir solicitudes entre dominios
                    },
                    success: function(response) {
                        console.log('response')
                        // Manejar la respuesta del servidor si es necesario
                        //window.location.href = '../../inventario/inventario/ventas'
                        console.log(response)
                    },
                    error: function(xhr, status, error) {
                        // Manejar errores de la solicitud AJAX
                        console.error('Error al guardar los datos:', error);
                    }
                });
           
            })
          

            // Aquí puedes continuar con el resto de la lógica para guardar la venta
        }
     })

})
function eleccionVenta(a){
    console.log("eleccion", a);
    if(a=="Efectivo"){
        document.getElementById('subtotal').hidden =false
        document.getElementById('devolucion').hidden = false
     
        return ;
    }
    document.getElementById('subtotal').hidden =true
    document.getElementById('devolucion').hidden = true
}


document.addEventListener('DOMContentLoaded', function(){
    const subtotal = document.getElementById('subtotal')
    const totalElement = document.getElementById('Total');
    const devolucion = document.getElementById('devolucion')
    subtotal.addEventListener('input', function(event){
        let evento = event.target.value;
        let valor =  evento - parseInt(totalElement.textContent.replace(/\$/g, '').replace(/^Total:\s*/, ''));
       if(event.target.value){
        devolucion.value = valor
       }else{
        devolucion.value = 0
       }
        return devolucion
    })

    
})
   
function mostrarTotal(carritoElement) {
    // Eliminar cualquier fila existente que muestre el total
    this.descontar = 0
    const totalElement = document.getElementById('Total');
    if (totalElement) {
        totalElement.remove();
    }
    
    // Calcular el total sumando los precios de todos los productos
   
    carritoElement.querySelectorAll('table tbody tr').forEach(row => {
        const precio = parseInt(row.querySelector('td:nth-child(3)').textContent);
        this.descontar += precio;
    });
    
    // Crear un elemento div para mostrar el total
    const totalDiv = document.createElement('div');
    totalDiv.id = 'Total';
    totalDiv.textContent = 'Total: $' + this.descontar; // Mostrar el total con dos decimales
    
    // Agregar el total al contenedor carritoElement
    carritoElement.appendChild(totalDiv);
    return this.descontar
    }
    

