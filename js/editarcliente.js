(function() {

    let DB;
    let idCliente;

    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const empresaInput = document.getElementById('empresa');

    const formulario = document.getElementById('formulario');

    document.addEventListener('DOMContentLoaded', () => {
        // Conectar a la base de datos
        conectarDB();

        // Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente)

        // Verificar id de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        console.log(idCliente);

        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);              
            }, 100);
        }
    });



    function actualizarCliente(e) {
        e.preventDefault();

        if(nombreInput.value === '' || telefonoInput.value === '' || empresaInput.value === '' || emailInput.value === '') {
            imprimirAlerta('Todos los campos son obligatiros', 'error');

            return;
        }

        // Actualizar cliente en la DB
        const clienteActualizado = {
            nombre: nombreInput.value,
            telefono: telefonoInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            console.log('Actualizaco correctamente');
        }

        transaction.onerror = () => {
            imprimirAlerta('Algo malió sal :(', 'error');
        }

        imprimirAlerta('El cliente se ha actualizado');

        formulario.reset();
    }
 
    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e) {
            const cursor = e.target.result;
            
            if(cursor) {
                if( cursor.value.id === Number(id) ) {
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
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

})();