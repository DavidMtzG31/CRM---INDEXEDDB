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




    function crearNuevoCliente(cliente) {
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');
    objectStore.add(cliente);

    transaction.onerror = () => {
        console.log('Hubo un error');
        imprimirAlerta('Error al agregar, el correo ya está registrado', 'error');
    }

    transaction.oncomplete = () => {
        imprimirAlerta('Cliente agregado correctamente');
        console.log('Cliente agregado');
        formulario.reset();
    }
    }

}) ();
