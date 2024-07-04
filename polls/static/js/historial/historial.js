document.addEventListener('DOMContentLoaded', function(){
    $('#dataTable').DataTable({
        "lengthMenu": [[8, 25, 50, -1], [8, 25, 50, "Todos"]],
        "defaultContent":"<button>Editar</button>",                  
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "No se encontraron registros",
            "info": "",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales)",
            "search": "Buscar Por código:",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        "searching":false
       
    })
  console.log("hola")
})

