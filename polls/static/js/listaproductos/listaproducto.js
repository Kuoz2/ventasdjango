document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('spinner-overlay').style.display = 'block';
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            var searchValue = $('#dt-search-0').val().trim(); // Supongamos que tienes un input con id 'mySearchInput' para ingresar el código
            var codigo = data[0]; // Supongamos que la columna del código es la primera (índice 0)
            if(searchValue){
                return codigo === searchValue;
            }else{
                return data
            }
        }
    );
    
   
   var table = $('#dataTable').DataTable({
        "lengthMenu": [[8, 25, 50, -1], [8, 25, 50, "Todos"]],
        "defaultContent":"<button>Editar</button>",                  
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros por pagina",
            "zeroRecords": "No se encontraron registros",
            "info": "",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales)",
            "search": "Buscar Por codigo:",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        }
       
    })
    $('#dt-search-0').on('keyup', function() {
        table.draw(); // Vuelve a dibujar la tabla con el filtro aplicado
    });
})




window.addEventListener('load', function(){
    this.document.getElementById('spinner-overlay').style.display = 'none';
})