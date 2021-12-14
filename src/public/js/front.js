
const actualizarContenedor = (solicitudes, rol) => {
    let solicitudesContainer = $('#solicitudes');
    solicitudesContainer.html('');
    console.log(solicitudes);
    solicitudes.forEach((solicitud, indice) => {
        solicitudesContainer.append(`
                        <section class="solicitud">
                            <header class="solicitud__cabecera">
                                <h3 class="solicitud__titulo"><span class="solicitud__numero">${indice + 1}° </span>${solicitud.Estudiante}</h3>
                                <h4 class="solicitud__titulo"><span class="solicitud__encabezado">${solicitud.Encabezado}</span></h4>
                            </header>
                            <main class="solicitud__cuerpo">
                                <ul class="solicitud__atributos">
                                    <li class="solicitud__atributoGrupo"><span class="solicitud__atributo">Categoria: </span>${solicitud.Categoria}</li>
                                    <li class="solicitud__atributoGrupo"><span class="solicitud__atributo">Prioridad: </span>${solicitud.Prioridad}</li>
                                    <li class="solicitud__atributoGrupo"><span class="solicitud__atributo">Fecha: </span>${solicitud.Fecha}</li>
                                    <li class="solicitud__atributoGrupo"><span class="solicitud__atributo">Tipo: </span>${solicitud.Tipo}</li>
                                    <li class="solicitud__atributoGrupo"><span class="solicitud__atributo">Estado: </span>${solicitud.Estado}</li>
                                </ul>
                                <a class="solicitud__boton" href="/${rol}/solicitud/detalles/${solicitud.Id}">Detalles</a>
                            </main>
                        </section>  
                    `);
    });
};

const listarCategoria = (data, rol) => {
    let table = $('#body-table');
    table.html('');
    data.forEach((item, indice) => {
        const coord = item.Coordinacion ? item.Coordinacion : '';
        table.append(`
        <tr class="table__row">
            <td class="table__data">${indice + 1}°</td>
            <td class="table__data">${item.Id}</td>
            <td class="table__data">${item.Nombre}</td>
            <td class="table__data">${item.Descripcion}</td>
            <td class="table__data">${coord}</td>
            <td class="table__data">${item.Prioridad}</td>
        </tr>`
        );
    });
};

const listarTipo = (data, rol) => {
    let table = $('#body-table');
    table.html('');
    data.forEach((item, indice) => {
        table.append(`
        <tr class="table__row">
            <td class="table__data">${indice + 1}°</td>
            <td class="table__data">${item.Id}</td>
            <td class="table__data">${item.Nombre}</td>
            <td class="table__data">${item.Prioridad}</td>
        </tr>`
        );
    });
};

const listarSecretaria = (data, rol) => {
    let table = $('#body-table');
    table.html('');
    data.forEach((item, indice) => {
        table.append(`
        <tr class="table__row">
            <td class="table__data">${indice + 1}°</td>
            <td class="table__data">${item.Identificacion}</td>
            <td class="table__data">${item.Nombre}</td>
            <td class="table__data">${item.Apellidos}</td>
            <td class="table__data">${item.Celular}</td>
        </tr>`
        );
    });
};

const listarPrioridad = (data, rol) => {
    let table = $('#body-table');
    table.html('');
    data.forEach((item, indice) => {
        table.append(`
        <tr class="table__row">
            <td class="table__data">${indice + 1}°</td>
            <td class="table__data">${item.Id}</td>
            <td class="table__data">${item.Nombre}</td>
            <td class="table__data">${item.Nivel}</td>
        </tr>`
        );
    });
};

const listarPreguntaFrecuente = (data, rol) => {
    let table = $('#body-table');
    table.html('');
    data.forEach((item, indice) => {
        table.append(`
        <tr class="table__row">
            <td class="table__data">${indice + 1}°</td>
            <td class="table__data">${item.Id}</td>
            <td class="table__data">${item.Pregunta}</td>
            <td class="table__data">${item.Respuesta}</td>
        </tr>`
        );
    });
};

const listarDocente = (data, rol) => {
    let table = $('#body-table');
    table.html('');
    data.forEach((item, indice) => {
        table.append(`
        <tr class="table__row">
            <td class="table__data">${indice + 1}°</td>
            <td class="table__data">${item.CodigoUAC}</td>
            <td class="table__data">${item.Nombre}</td>
            <td class="table__data">${item.Apellidos}</td>
            <td class="table__data">${item.Celular}</td>
        </tr>`
        );
    });
};

const listarCoordinacion = (data, rol) => {
    let table = $('#body-table');
    table.html('');
    data.forEach((item, indice) => {
        table.append(`
        <tr class="table__row">
            <td class="table__data">${indice + 1}°</td>
            <td class="table__data">${item.Id}</td>
            <td class="table__data">${item.Nombre}</td>
            <td class="table__data">${item.Docente}</td>
        </tr>`
        );
    });
};

const listarReportes = (data, rol) => {
    let table = $('#body-table');
    table.html('');
    data.forEach((item, indice) => {
        table.append(`
        <tr class="table__row">
            <td class="table__data">${indice + 1}°</td>
            <td class="table__data">${item.Nombre}</td>
            <td class="table__data">${item.Cantidad}</td>
        </tr>`
        );
    });
};

$(() => {
    
    const roles = {
        admin: 'admin',
        practicas: 'coorPracticas',
        tutoria: 'coorTutoria',
        seguimiento: 'coorSeguimiento',
        cisco: 'coorCisco',
        secretaria: 'secretaria'
    };
    // Admin

    $('#filtro-categoria').on('change', () => {
        const val = $('#filtro-categoria :selected').val();
        const url = `/${roles.admin}/categoria-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.admin);
            }
        });
        $('#filtro-categoria').prop('selectedIndex', 0);
    });

    $('#filtro-tipo').on('change', () => {
        const val = $('#filtro-tipo :selected').val();
        const url = `/${roles.admin}/tipo-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.admin);
            }
        });
        $('#filtro-categoria').prop('selectedIndex', 0);
    });

    $('#filtro-prioridad').on('change', () => {
        const val = $('#filtro-prioridad :selected').val();
        const url = `/${roles.admin}/prioridad-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.admin);
            }
        });
        $('#filtro-categoria').prop('selectedIndex', 0);
    });


    $('#btnAdminEnviado').on('click', () => {
        const url = `/${roles.admin}/enviado`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.admin);
            }
        });
    });

    $('#btnAdminProceso').on('click', () => {
        const url = `/${roles.admin}/en-proceso`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.admin);
            }
        });
    });

    $('#btnAdminAtendido').on('click', () => {
        const url = `/${roles.admin}/atendido`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.admin);
            }
        });
    });

    // Secretaria
    $('#filtro-categoria-secretaria').on('change', () => {
        const val = $('#filtro-categoria-secretaria :selected').val();
        const url = `/${roles.secretaria}/categoria-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.secretaria);
            }
        });
        $('#filtro-categoria-secretaria').prop('selectedIndex', 0);
    });

    $('#filtro-tipo-secretaria').on('change', () => {
        const val = $('#filtro-tipo-secretaria :selected').val();
        const url = `/${roles.secretaria}/tipo-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.secretaria);
            }
        });
        $('#filtro-categoria-secretaria').prop('selectedIndex', 0);
    });

    $('#filtro-prioridad-secretaria').on('change', () => {
        const val = $('#filtro-prioridad-secretaria :selected').val();
        const url = `/${roles.secretaria}/prioridad-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.secretaria);
            }
        });
        $('#filtro-categoria-secretaria').prop('selectedIndex', 0);
    });


    $('#btnSecretariaEnviado').on('click', () => {
        const url = `/${roles.secretaria}/enviado`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.secretaria);
            }
        });
    });

    $('#btnSecretariaProceso').on('click', () => {
        const url = `/${roles.secretaria}/en-proceso`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.secretaria);
            }
        });
    });

    $('#btnSecretariaAtendido').on('click', () => {
        const url = `/${roles.secretaria}/atendido`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.secretaria);
            }
        });
    });

    // Practicas
    $('#filtro-tipo-practicas').on('change', () => {
        const val = $('#filtro-tipo-practicas :selected').val();
        const url = `/${roles.practicas}/tipo-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.practicas);
            }
        });
        $('#filtro-tipo-practicas').prop('selectedIndex', 0);
    });

    $('#filtro-prioridad-practicas').on('change', () => {
        const val = $('#filtro-prioridad-practicas :selected').val();
        const url = `/${roles.practicas}/prioridad-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.practicas);
            }
        });
        $('#filtro-prioridad-practicas').prop('selectedIndex', 0);
    });

    $('#btnPracticasEnviado').on('click', () => {
        const url = `${roles.practicas}/enviado`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.practicas);
            }
        });
    });

    $('#btnPracticasProceso').on('click', () => {
        const url = `${roles.practicas}/en-proceso`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.practicas);
            }
        });
    });

    $('#btnPracticasAtendido').on('click', () => {
        const url = `${roles.practicas}/atendido`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.practicas);
            }
        });
    });


    // Cisco 
    $('#filtro-tipo-cisco').on('change', () => {
        const val = $('#filtro-tipo-cisco :selected').val();
        const url = `/${roles.cisco}/tipo-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.cisco);
            }
        });
        $('#filtro-tipo-cisco').prop('selectedIndex', 0);
    });

    $('#filtro-prioridad-cisco').on('change', () => {
        const val = $('#filtro-prioridad-cisco :selected').val();
        const url = `/${roles.cisco}/prioridad-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.cisco);
            }
        });
        $('#filtro-prioridad-cisco').prop('selectedIndex', 0);
    });

    $('#btnCiscoEnviado').on('click', () => {
        const url = `${roles.cisco}/enviado`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.cisco);
            }
        });
    });

    $('#btnCiscoProceso').on('click', () => {
        const url = `${roles.cisco}/en-proceso`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.cisco);
            }
        });
    });

    $('#btnCiscoAtendido').on('click', () => {
        const url = `${roles.cisco}/atendido`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.cisco);
            }
        });
    });


    // Tutoria
    $('#filtro-tipo-tutoria').on('change', () => {
        const val = $('#filtro-tipo-tutoria :selected').val();
        const url = `/${roles.tutoria}/tipo-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.tutoria);
            }
        });
        $('#filtro-tipo-tutoria').prop('selectedIndex', 0);
    });

    $('#filtro-prioridad-tutoria').on('change', () => {
        const val = $('#filtro-prioridad-tutoria :selected').val();
        const url = `/${roles.tutoria}/prioridad-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.tutoria);
            }
        });
        $('#filtro-prioridad-tutoria').prop('selectedIndex', 0);
    });

    $('#btnTutoriaEnviado').on('click', () => {
        const url = `${roles.tutoria}/enviado`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.tutoria);
            }
        });
    });

    $('#btnTutoriaProceso').on('click', () => {
        const url = `${roles.tutoria}/en-proceso`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.tutoria);
            }
        });
    });

    $('#btnTutoriaAtendido').on('click', () => {
        const url = `${roles.tutoria}/atendido`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.tutoria);
            }
        });
    });


    // Seguimiento 
    $('#filtro-tipo-seguimiento').on('change', () => {
        const val = $('#filtro-tipo-seguimiento :selected').val();
        const url = `/${roles.seguimiento}/tipo-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.seguimiento);
            }
        });
        $('#filtro-tipo-seguimiento').prop('selectedIndex', 0);
    });

    $('#filtro-prioridad-seguimiento').on('change', () => {
        const val = $('#filtro-prioridad-seguimiento :selected').val();
        const url = `/${roles.seguimiento}/prioridad-filtro/${val}`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.seguimiento);
            }
        });
        $('#filtro-prioridad-seguimiento').prop('selectedIndex', 0);
    });

    $('#btnSeguimientoEnviado').on('click', () => {
        const url = `${roles.seguimiento}/enviado`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.seguimiento);
            }
        });
    });

    $('#btnSeguimientoProceso').on('click', () => {
        const url = `${roles.seguimiento}/en-proceso`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.seguimiento);
            }
        });
    });

    $('#btnSeguimientoAtendido').on('click', () => {
        const url = `${roles.seguimiento}/atendido`;
        $.ajax({
            url,
            success: (solicitudes) => {
                actualizarContenedor(solicitudes, roles.seguimiento);
            }
        });
    });


    $('#btnListarCategoria').on('click', () => {
        const url = `/${roles.admin}/listar-categoria`;
        $.ajax({
            url,
            success: (data) => {
                listarCategoria(data, roles.admin);
            }
        });
    });

    $('#btnListarTipo').on('click', () => {
        const url = `/${roles.admin}/listar-tipo`;
        $.ajax({
            url,
            success: (data) => {
                console.log(data);
                listarTipo(data, roles.admin);
            }
        });
    });

    $('#btnListarSecretaria').on('click', () => {
        const url = `/${roles.admin}/listar-secretaria`;
        $.ajax({
            url,
            success: (data) => {
                listarSecretaria(data, roles.admin);
            }
        });
    });

    $('#btnListarPrioridad').on('click', () => {
        const url = `/${roles.admin}/listar-prioridad`;
        $.ajax({
            url,
            success: (data) => {
                listarPrioridad(data, roles.admin);
            }
        });
    });

    $('#btnListarPreguntaFrecuente').on('click', () => {
        const url = `/${roles.admin}/listar-preguntaFrecuente`;
        $.ajax({
            url,
            success: (data) => {
                listarPreguntaFrecuente(data, roles.admin);
            }
        });
    });

    $('#btnListarDocente').on('click', () => {
        const url = `/${roles.admin}/listar-docente`;
        $.ajax({
            url,
            success: (data) => {
                listarDocente(data, roles.admin);
            }
        });
    });

    $('#btnListarCoordinacion').on('click', () => {
        const url = `/${roles.admin}/listar-coordinacion`;
        $.ajax({
            url,
            success: (data) => {
                listarCoordinacion(data, roles.admin);
            }
        });
    });

    $('#btnReportes').on('click', (error) => {
        const fechaI = $('#txtFechaI').val();
        const fechaF = $('#txtFechaF').val();
        const criterio = $('#txtCriterio').val();
        let errorContainer = $('#error-container');
        let mensajesAdvertencia = false;
        console.log(fechaI);
        console.log(fechaF);
        console.log(criterio);
        if (!criterio) {
            mensajesAdvertencia = 'Debe seleccionar un criterio para el filtro';
        }
        if (!fechaF) {
            mensajesAdvertencia = 'Debe seleccionar una fecha de fin';
        }
        if (!fechaI) {
            mensajesAdvertencia = 'Debe seleccionar una fecha de inicio';
        }

        if (mensajesAdvertencia) {
            errorContainer.html(`<p class="error">${mensajesAdvertencia}</p>`);
        } else {
            const url = `/${roles.admin}/report/${fechaI}/${fechaF}/${criterio}`;
            $.ajax({
                url,
                success: (data) => {
                    listarReportes(data, roles.admin);
                }
            });
        }
        
            
        
    });

    
    
})