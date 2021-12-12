
const nsCategoria = document.getElementById('ns-categoria');
const nsTipo = document.getElementById('ns-tipo');
const nsEncabezado = document.getElementById('ns-encabezado');
const nsForm = document.getElementById('form-nuevaSolicitud');
const errorContainer = document.getElementById('error-container');
const menForm = document.getElementById('form-seguimientoMensaje');
const mensaje = document.getElementById('chat-mensaje');
const formEliminar = document.getElementById('form-eliminar');
const txtId = document.getElementById('txtId');
const txtNombre = document.getElementById('txtNombre');
const txtDescripcion = document.getElementById('txtDescripcion');
const txtCoordinacion = document.getElementById('txtCoordinacion');
const txtPrioridad = document.getElementById('txtPrioridad');
const txtIdEliminar = document.getElementById('txtIdEliminar');
const txtPregunta = document.getElementById('txtPregunta');
const txtRespuesta = document.getElementById('txtRespuesta');
const txtDocente = document.getElementById('txtDocente');
const txtApellidos = document.getElementById('txtApellidos');
const txtCodigo = document.getElementById('txtCodigo');
const txtCelular = document.getElementById('txtCelular');
const txtIdentificacion = document.getElementById('txtIdentificacion');
const txtNivel = document.getElementById('txtNivel');



try {
    nsForm.addEventListener('submit', (error) => {
        let mensajesAdvertencia = false;
        const tipo = nsTipo.value;
        const categoria = nsCategoria.value;
        const encabezado = nsEncabezado.value;
    
        if (!categoria) {
            mensajesAdvertencia = 'Debe seleccionar alguna categoría';
        }
        if (!tipo) {
            mensajesAdvertencia = 'Debe seleccionar algún tipo';
        }
        if (!encabezado.trim()) {
            mensajesAdvertencia = 'Debe indicar un título para su solicitud';
        }
        
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }
    });
} catch (error) {
    console.log('Formulario incorrecto');
}

try {
        
    menForm.addEventListener('submit', (error) => {
        const nuevoMensaje = mensaje.value;
        let mensajesAdvertencia = false;
        if (!nuevoMensaje.trim()) {
            mensajesAdvertencia = 'Debe llenar el mensaje antes de enviar';
        }
        console.log(nuevoMensaje, mensajesAdvertencia);
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }
    });
} catch (error) {
    console.log('Formulario incorrecto');
}

try {
    formEliminar.addEventListener('submit', (error) => {
        const idEliminar = txtIdEliminar.value;
        let mensajesAdvertencia = false;
        if (!idEliminar.trim()) {
            mensajesAdvertencia = 'Debe indicar el identificador para poder remover';
        }
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }
    });
} catch (error) {
    console.log("No esta el formulario eliminar");
}

try {
    const formCategoriaCrud = document.getElementById('form-categoriaCrud');
    formCategoriaCrud.addEventListener('submit', (error) => {
        const id = txtId.value;
        const nombre = txtNombre.value;
        const descripcion = txtDescripcion.value;
        const coordinacion = txtCoordinacion.value;
        const prioridad = txtPrioridad.value;
        let mensajesAdvertencia = false;
        if (!prioridad) {
            mensajesAdvertencia = 'Debe seleccionar alguna prioridad';
        }
        if (!nombre.trim()) {
            mensajesAdvertencia = 'Debe indicar el nombre de la categoría';
        } 
        if (!id.trim()) {
            mensajesAdvertencia = 'Debe indicar el identificador de la categoría';
        } 
        
        if (!descripcion.trim()) {
            txtDescripcion.value = descripcion.trim();
        } 
        

        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }
    });

} catch (error) {
    console.log('Formulario incorrecto');
}

try {
    const formTipoCrud = document.getElementById('form-tipoCrud');
    formTipoCrud.addEventListener('submit', (error) => {
        const id = txtId.value;
        const nombre = txtNombre.value;
        const prioridad = txtPrioridad.value;
        let mensajesAdvertencia = false;
        if (!prioridad) {
            mensajesAdvertencia = 'Debe seleccionar alguna prioridad';
        }
        if (!nombre.trim()) {
            mensajesAdvertencia = 'Debe indicar el nombre del tipo';
        }
        if (!id.trim()) {
            mensajesAdvertencia = 'Debe indicar el identificador del tipo';
        }
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }
    
    });
    
} catch (error) {
    console.log('Formulario incorrecto');
}

try {
    const formPreguntaFrecuenteCrud = document.getElementById('form-preguntaFrecuenteCrud');

    formPreguntaFrecuenteCrud.addEventListener('submit', (error) => {
        const id = txtId.value;
        const pregunta = txtPregunta.value;
        const respuesta = txtRespuesta.value;
        let mensajesAdvertencia = false;
        if (!respuesta.trim()) {
            mensajesAdvertencia = 'Debe indicar la respuesta a la pregunta';
        }
        if (!pregunta.trim()) {
            mensajesAdvertencia = 'Debe indicar la pregunta';
        }
        if (!id.trim()) {
            mensajesAdvertencia = 'Debe indicar el identificador de la pregunta';
        }
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }
    });
    
} catch (error) {
    console.log(error);
}


try {
    const formCoordinacionCrud = document.getElementById('form-coordinacionCrud');
    formCoordinacionCrud.addEventListener('submit', (error) => {
        const id = txtId.value;
        const nombre = txtNombre.value;
        const docente = txtDocente.value;
        let mensajesAdvertencia = false;
        if (!docente) {
            mensajesAdvertencia = 'Debe seleccionar algún docente';
        }
        if (!nombre.trim()) {
            mensajesAdvertencia = 'Debe indicar el nombre de la coordinación';
        }
        if (!id.trim()) {
            mensajesAdvertencia = 'Debe indicar el identificador de la coordinacion';
        }
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }
    });
    
} catch (error) {
    console.log(error);
}


try {
    const formDocenteCrud = document.getElementById('form-docenteCrud');
    formDocenteCrud.addEventListener('submit', (error) => {
        const codigo = txtCodigo.value;
        const nombre = txtNombre.value;
        const apellidos = txtApellidos.value;
        const celular = txtCelular.value;
        let mensajesAdvertencia = false;
        if (!celular.trim()) {
            txtCelular.value = celular.trim();
        }
        if (!apellidos.trim()) {
            mensajesAdvertencia = 'Debe indicar los apellidos del docente';
        }
        if (!nombre.trim()) {
            mensajesAdvertencia = 'Debe indicar el nombre del docente';
        }
        if (!codigo.trim()) {
            mensajesAdvertencia = 'Debe indicar el código del docente';
        }
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }

    })
} catch (error) {
    console.log('Formulario incorrecto');
}

try {
    const formSecretariaCrud = document.getElementById('form-secretariaCrud');
    formSecretariaCrud.addEventListener('submit', (error) => {
        const identificacion = txtIdentificacion.value;
        const nombre = txtNombre.value;
        const apellidos = txtApellidos.value;
        const celular = txtCelular.value;
        let mensajesAdvertencia = false;
        if (!celular.trim()) {
            txtCelular.value = celular.trim();
        }
        if (!apellidos.trim()) {
            mensajesAdvertencia = 'Debe indicar los apellidos de la secretaria';
        }
        if (!nombre.trim()) {
            mensajesAdvertencia = 'Debe indicar el nombre de la secretaria';
        }
        if (!identificacion.trim()) {
            mensajesAdvertencia = 'Debe indicar la identificacion de la secretaria';
        }
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }

    });
} catch (error) {
    console.log('Formulario incorrecto');
}

try {
    const formPrioridadCrud = document.getElementById('form-prioridadCrud');
    formPrioridadCrud.addEventListener('submit', (error) => {
        const id = txtId.value;
        const nombre = txtNombre.value;
        const nivel = txtNivel.value;
        let mensajesAdvertencia = false;
        if (!nivel) {
            mensajesAdvertencia = 'Debe indicar un nivel para la prioridad';
        }
        if (!nombre.trim()) {
            mensajesAdvertencia = 'Debe indicar el nombre de la prioridad';
        }
        if (!id.trim()) {
            mensajesAdvertencia = 'Debe indicar el identificador de la prioridad';
        }
        if (mensajesAdvertencia) {
            error.preventDefault();
            errorContainer.innerHTML = `<p class="error">${mensajesAdvertencia}</p>`
        }
    });
} catch (error) {
    console.log('Formulario incorrecto');
}

