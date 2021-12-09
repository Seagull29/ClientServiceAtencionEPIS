
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

const actualizarCrud = (render, rol) => {
    let crudContainer = $('#ajax-crud');
    crudContainer.html(render);
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

    /*Admin crud*/
    $('#crud-tipo').on('click', () => {
        const url = `/${roles.admin}/crud-tipo`;
        $.ajax({
            url,
            dataType: 'html',
            success: (render) => {
                actualizarCrud(render, roles.admin);
            }
        });
    });

    $('#crud-categoria').on('click', () => {
        const url = `/${roles.admin}/crud-categoria`;
        $.ajax({
            url,
            dataType: 'html',
            success: (render) => {
                actualizarCrud(render, roles.admin);
            }
        });
    });

    $('#crud-prioridad').on('click', () => {
        const url = `/${roles.admin}/crud-prioridad`;
        $.ajax({
            url,
            dataType: 'html',
            success: (render) => {
                actualizarCrud(render, roles.admin);
            }
        });
    });

    $('#crud-docente').on('click', () => {
        const url = `/${roles.admin}/crud-docente`;
        $.ajax({
            url,
            dataType: 'html',
            success: (render) => {
                actualizarCrud(render, roles.admin);
            }
        });
    });

    $('#crud-coordinacion').on('click', () => {
        const url = `/${roles.admin}/crud-coordinacion`;
        $.ajax({
            url,
            dataType: 'html',
            success: (render) => {
                actualizarCrud(render, roles.admin);
            }
        });
    });

    $('#crud-preguntafrecuente').on('click', () => {
        const url = `/${roles.admin}/crud-preguntafrecuente`;
        $.ajax({
            url,
            dataType: 'html',
            success: (render) => {
                actualizarCrud(render, roles.admin);
            }
        });
    });

    $('#crud-secretaria').on('click', () => {
        const url = `/${roles.admin}/crud-secretaria`;
        $.ajax({
            url,
            dataType: 'html',
            success: (render) => {
                actualizarCrud(render, roles.admin);
            }
        });
    });

    
})