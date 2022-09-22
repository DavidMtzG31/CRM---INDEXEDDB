(function() {

    let DB;
    const formulario = document.getElementById('formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });



    function validarCliente(e) {
        e.preventDefault();

        // Leer todos los inputs
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const empresa = document.getElementById('empresa').value;

        if(nombre === '' || email === '' || telefono === '' || telefono.length >= 11 || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error')

            return;
        }

            // Crear un objeto con la información
            const cliente = {
                nombre,
                email,
                telefono,
                empresa,
                id: Date.now()
            }

                crearNuevoCliente(cliente);
                console.log(cliente);

    }


    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = () => {
            console.log('Hubo un error');
        }
    
        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result;
            console.log('La base ya está creada');
        }
    }

    
    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.add(cliente);

    transaction.onerror = () => {
        console.log('Hubo un error');
        Swal.fire({
            icon: 'error',
            title: 'El correo ya está registrado',
            showConfirmButton: false,
            timer: 1500
          })
    }

    transaction.oncomplete = () => {
        Swal.fire({
            icon: 'success',
            title: 'Cliente agregado exitosamente',
            showConfirmButton: false,
            timer: 1500
          })
        console.log('Cliente agregado');
        formulario.reset();
    }
    }

}) ();
