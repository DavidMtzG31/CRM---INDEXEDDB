(function(){

    const listadoClientes = document.querySelector('#listado-clientes');
    let confirmar;
    let idEliminar;

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if(window.indexedDB.open('crm', 1) ) {
            obtenerClienter();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if(e.target.classList.contains('eliminar')) {
            idEliminar = Number(e.target.dataset.cliente);
            
            Swal.fire({
                title: '¿Eliminar Cliente?',
                text: "Esta acción no se puede revertir",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'green',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                    eliminarDB();
                    e.target.parentElement.parentElement.remove();
                  Swal.fire(
                    'Eliminado!',
                    'El cliente ha sido eliminado',
                    'success',
                     showConfirmButton: false,
                  )
                }
              })
    }
}

    function eliminarDB() {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        
        objectStore.delete(idEliminar);

        transaction.oncomplete = function(e) {
            console.log('Se eliminó con éxito...')
            e.target.parentElement.parentElement.remove();
        }

        transaction.onerror = function () {
            console.log('No se eliminó...')
        }
    }

    // Crea la BD
    function crearDB() {
        // Variables para la DB
const crearDB = window.indexedDB.open('crm', 1);
let DB;


// Base de datos
if(crearDB) {

    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;
        const objectStore = db.createObjectStore('crm', {
            keyPath: 'id',
            autoIncrement: true
        });
                          // Nombre   // Keypad
        objectStore.createIndex('nombre', 'nombre', {unique: false});
        objectStore.createIndex('email', 'email', {unique: true});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('empresa', 'empresa', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});

        console.log('DB Lista y creada');
    };

    crearDB.onsuccess = function () {
        DB = crearDB.result;
        console.log('DB creada');
    };

    crearDB.onerror = function () {
        console.log('Error al crear la BD')
    };
}

    }

    function obtenerClienter() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () => {
            console.log('Error');
        }

        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;
                cursor.continue();

                if(cursor) {
                    const { nombre, empresa, email, telefono, id } = cursor.value;
                    listadoClientes.innerHTML += 
                    ` <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                      </tr> `;


                } else {
                    console.log('No hay más registros...');
                }
            }
        }
    }


})();
