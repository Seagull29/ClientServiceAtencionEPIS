import express, { Request, Response, Router } from "express";
import { isLoggedIn, upload, admin, authRole, ROLES } from "@config/util";
import { Solicitud } from "@models/solicitud";
import { Estudiante } from "@models/estudiante";
import { Mensaje } from "@models/mensaje";
import { v4 } from "uuid";
import { Multimedia } from "@models/multimedia";
import { promisify } from "util";
import { Categoria } from "@models/categoria";
import { Tipo } from "@models/tipo";
import { Prioridad } from "@models/prioridad";
import path from "path";
import FormData from "form-data";
import fs from "fs";
import { PreguntaFrecuente } from "@models/preguntaFrecuente";
import { Docente } from "@models/docente";
import { Secretaria } from "@models/secretaria";
import { Coordinacion } from "@models/coordinacion";
import { Reporte } from "@models/reporte";


const router: Router = express.Router();

router.get('/', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const solicitudes = await Solicitud.list();
    const categorias = await Categoria.list();
    const tipos = await Tipo.list();
    const prioridades = await Prioridad.list();
    res.render('admins/home', {
        user: req.user,
        solicitudes,
        categorias,
        tipos,
        prioridades,
        coordinador: 'admin'
    });
});

router.get('/solicitud/detalles/:id',  isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {

    const user: any = req.user;
    const solicitudRequest = await Solicitud.search(req.params.id, 'id');
    const solicitud = solicitudRequest[0];

    const estudiante = await Estudiante.search(solicitud.Estudiante, 'codigo');
    const mensajes = await Mensaje.search(solicitud.Id, 'solicitud');


    const archivoSolicitud = await Multimedia.search(solicitud.Id, 'solicitud');
    const multimedia = await Multimedia.list();


    if (archivoSolicitud.length) {
        solicitud.tieneArchivos = true;
        solicitud.archivos = archivoSolicitud;
    } else {
        solicitud.tieneArchivos = false;
    }

    const archivosMensajes = mensajes.map(mensaje => {
        const { Id } = mensaje;
        const matchMultimedia = multimedia.filter(archivo => archivo.Mensaje === Id);
        const mensajeCompleto = {
            ...mensaje
        };
        if (matchMultimedia.length) {
            mensajeCompleto.tieneArchivos = true;

            mensajeCompleto.archivos = matchMultimedia;

        } else {

            mensajeCompleto.tieneArchivos = false;
        }
        return mensajeCompleto;
    });

    console.log(solicitud);

    res.render('admins/solicitud', {
        user,
        estudiante: estudiante[0],
        solicitud,
        archivosMensajes
    });

});

router.get('/descarga/:id', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { id } = req.params;
    const pedido = await Multimedia.search(id, 'id');
    const archivo = pedido[0];
    const carpetaPublica: string = path.join(__dirname, '../../src/public/uploads');
    const nombreCompleto: string = archivo.Id.concat(path.extname(archivo.Nombre));
    const direccion: string = `${carpetaPublica}/${nombreCompleto}`;
    fs.writeFileSync(direccion, Buffer.from(archivo.Archivo));
    const tiposAceptados = /jpeg|jpg|png|pdf/;
    res.download(direccion);

});

router.post('/solicitud/nuevo-mensaje', isLoggedIn, authRole(ROLES.ADMIN), upload.array('archivo-mensaje', 5), async (req: Request, res: Response) => {
    const { mensaje, solicitudId, coordinacion } = req.body;
    const user: any = req.user;
    try {
        const solicitudRequest = await Solicitud.search(solicitudId, 'dev');
        const solicitud = solicitudRequest[0];
        const files: any = req.files;
        const user: any = req.user;

        const today = new Date();
        today.setHours(today.getHours() - 5);

        const updated: any = await Solicitud.update({
            id: solicitud.Id,
            encabezado: solicitud.Encabezado,
            descripcion: solicitud.Descripcion,
            fecha: solicitud.Fecha,
            categoria: solicitud.Categoria,
            estudiante: solicitud.Estudiante,
            tipo: solicitud.Tipo,
            estado: 'En proceso'
        });

        const nuevoMensaje = await Mensaje.add({
            id: Date.now() + v4() + user.code.slice(0, 2),
            cuerpo: mensaje,
            fecha: today,
            solicitud: solicitudId,
            docente: 'hespetia'
        });

        console.log(updated);
        console.log(nuevoMensaje);

        if (nuevoMensaje && files.length) {

            const filesToAdd = files.map(file => {
                const formData = new FormData();
                const fileId = file.filename.slice(0, -path.extname(file.filename).length);
                formData.append('id', fileId);
                formData.append('nombre', file.originalname);
                formData.append('extension', file.mimetype);
                formData.append('archivo', fs.readFileSync(file.path), file.filename);
                formData.append('mensaje', nuevoMensaje.added.id);
                return formData;
            });

            filesToAdd.forEach(async file => {
                const recentAdded = await Multimedia.add(file, file.getHeaders());
            });
            const unlinkAsync = promisify(fs.unlink);
            files.forEach(async file => await unlinkAsync(file.path));
        }
        setTimeout(() => {
            res.redirect(`/admin/solicitud/detalles/${solicitudId}`);
        }, 1500);


    } catch (err) {
        console.log(err);
        res.redirect(`/admin/solicitud/detalles/${solicitudId}`);
    }
});

router.post('/agregar-categoria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtNombre: nombre,
        txtDescripcion: descripcion,
        txtCoordinacion: coordinacion,
        txtPrioridad: prioridad
    } = req.body;

    let idCat = !id ? `Cat${v4().slice(0, 6)}` : id;
    let coordCat = coordinacion ? coordinacion : null;
    const nuevaCat = await Categoria.add({
        id: idCat,
        nombre,
        descripcion,
        coordinacion: coordCat,
        prioridad
    });

    console.log(nuevaCat);
    res.redirect('/admin/crud-categoria');
});

router.post('/actualizar-categoria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtNombre: nombre,
        txtDescripcion: descripcion,
        txtCoordinacion: coordinacion,
        txtPrioridad: prioridad
    } = req.body;
    let coordCat = coordinacion ? coordinacion : null;
    const nuevaCat = await Categoria.update({
        id,
        nombre,
        descripcion,
        coordinacion: coordCat,
        prioridad
    });

    res.redirect('/admin/crud-categoria');
});

router.post('/eliminar-categoria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { txtId : id } = req.body;
    const eliminado = await Categoria.delete({
        id
    });
    res.redirect('/admin/crud-categoria');
});

router.post('/agregar-tipo', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtNombre: nombre,
        txtPrioridad: prioridad
    } = req.body;

    const nuevoTipo = await Tipo.add({
        id,
        nombre,
        prioridad
    });

    console.log(nuevoTipo);
    res.redirect('/admin/crud-tipo');
});

router.post('/actualizar-tipo', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtNombre: nombre,
        txtPrioridad: prioridad
    } = req.body;

    const nuevoTipo = await Tipo.update({
        id,
        nombre,
        prioridad
    });

    res.redirect('/admin/crud-tipo');
});

router.post('/eliminar-tipo', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { txtId : id } = req.body;
    const eliminado = await Tipo.delete({
        id
    });
    res.redirect('/admin/crud-tipo');
});

router.post('/agregar-docente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtCodigo: codigoUAC,
        txtNombre: nombre,
        txtApellidos: apellidos,
        txtCelular: celular
    } = req.body;

   
    const nuevoDocente = await Docente.add({
        codigoUAC,
        nombre,
        apellidos,
        celular
    });

    console.log(nuevoDocente);
    res.redirect('/admin/crud-docente');
});

router.post('/actualizar-docente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtCodigo: codigoUAC,
        txtNombre: nombre,
        txtApellidos: apellidos,
        txtCelular: celular
    } = req.body;

   
    const nuevoDocente = await Docente.update({
        codigoUAC,
        nombre,
        apellidos,
        celular
    });

    console.log(nuevoDocente);
    res.redirect('/admin/crud-docente');
});

router.post('/eliminar-docente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { txtCodigo : codigoUAC } = req.body;
    const eliminado = await Docente.delete({
        codigoUAC
    });
    res.redirect('/admin/crud-docente');
});

router.post('/agregar-secretaria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtIdentificacion: identificacion,
        txtNombre: nombre,
        txtApellidos: apellidos,
        txtCelular: celular
    } = req.body;

    const nuevaSecretaria = await Secretaria.add({
        identificacion,
        nombre,
        apellidos,
        celular
    });

    console.log(nuevaSecretaria);
    res.redirect('/admin/crud-secretaria');
});

router.post('/actualizar-secretaria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtIdentificacion: identificacion,
        txtNombre: nombre,
        txtApellidos: apellidos,
        txtCelular: celular
    } = req.body;

    const nuevaSecretaria = await Secretaria.update({
        identificacion,
        nombre,
        apellidos,
        celular
    });

    console.log(nuevaSecretaria);
    res.redirect('/admin/crud-secretaria');
});

router.post('/eliminar-secretaria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { txtIdentificacion : identificacion } = req.body;
    const eliminado = await Secretaria.delete({
        identificacion
    });
    res.redirect('/admin/crud-secretaria');
});

router.post('/agregar-prioridad', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtNombre: nombre,
        txtNivel: nivel,
    } = req.body;

    const nuevaPrioridad = await Prioridad.add({
        id,
        nombre,
        nivel: +nivel
    });

    console.log(nuevaPrioridad);
    res.redirect('/admin/crud-prioridad');
});

router.post('/actualizar-prioridad', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtNombre: nombre,
        txtNivel: nivel,
    } = req.body;

    const nuevaPrioridad = await Prioridad.update({
        id,
        nombre,
        nivel: +nivel
    });

    console.log(nuevaPrioridad);
    res.redirect('/admin/crud-prioridad');
});

router.post('/eliminar-prioridad', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { txtId : id } = req.body;
    const eliminado = await Prioridad.delete({
        id
    });
    res.redirect('/admin/crud-prioridad');
});

router.post('/agregar-preguntaFrecuente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtPregunta: pregunta,
        txtRespuesta: respuesta
    } = req.body;

    const preguntaFrecuente = await PreguntaFrecuente.add({
        id,
        administrador: admin,
        pregunta,
        respuesta
    });

    console.log(preguntaFrecuente);
    res.redirect('/admin/crud-preguntaFrecuente');
});

router.post('/actualizar-preguntaFrecuente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtPregunta: pregunta,
        txtRespuesta: respuesta
    } = req.body;

    const preguntaFrecuente = await PreguntaFrecuente.update({
        id,
        administrador: admin,
        pregunta,
        respuesta
    });

    console.log(preguntaFrecuente);
    res.redirect('/admin/crud-preguntaFrecuente');
});

router.post('/eliminar-preguntaFrecuente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { txtId : id } = req.body;
    const eliminado = await PreguntaFrecuente.delete({
        id
    });
    res.redirect('/admin/crud-preguntaFrecuente');
});


router.post('/agregar-coordinacion', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtNombre: nombre,
        txtDocente: docente
    } = req.body;

    const nuevaCoordinacion = await Coordinacion.add({
       id,
       nombre,
       docente
    });

    console.log(nuevaCoordinacion);
    res.redirect('/admin/crud-coordinacion');
});

router.post('/actualizar-coordinacion', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const {
        txtId: id,
        txtNombre: nombre,
        txtDocente: docente
    } = req.body;

    const nuevaCoordinacion = await Coordinacion.update({
       id,
       nombre,
       docente
    });

    console.log(nuevaCoordinacion);
    res.redirect('/admin/crud-coordinacion');
});

router.post('/eliminar-coordinacion', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { txtId : id } = req.body;
    const eliminado = await Coordinacion.delete({
        id
    });
    res.redirect('/admin/crud-coordinacion');
});

router.get('/listar-categoria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const categorias = await Categoria.list();
    res.json(categorias);
});

router.get('/listar-tipo', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const categorias = await Tipo.list();
    res.json(categorias);
});

router.get('/listar-prioridad', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const categorias = await Prioridad.list();
    res.json(categorias);
});

router.get('/listar-secretaria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const categorias = await Secretaria.list();
    res.json(categorias);
});

router.get('/listar-preguntaFrecuente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const categorias = await PreguntaFrecuente.list();
    res.json(categorias);
});

router.get('/listar-docente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const categorias = await Docente.list();
    res.json(categorias);
});

router.get('/listar-coordinacion', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const categorias = await Coordinacion.list();
    res.json(categorias);
});

router.get('/solicitud/cerrar/:id', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { id } = req.params;
    const respuesta = await Solicitud.search(id, 'dev');
    const solicitud = respuesta[0];
    const actualizado = await Solicitud.update({
        id: solicitud.Id,
        encabezado: solicitud.Encabezado,
        descripcion: solicitud.Descripcion,
        fecha: solicitud.Fecha,
        categoria: solicitud.Categoria,
        estudiante: solicitud.Estudiante,
        tipo: solicitud.Tipo,
        estado: 'Atendido'
    });
    res.redirect('/admin');

});

router.get('/crud-tipo', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const prioridades = await Prioridad.list();
    const identificadores = await Tipo.list();
    res.render('admins/tipoCrud', {
        user: req.user,
        prioridades,
        identificadores
    });

});

router.get('/crud-categoria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const prioridades = await Prioridad.list();
    const coordinaciones = await Coordinacion.list();
    const identificadores = await Categoria.list();
    res.render('admins/categoriaCrud', { 
        user: req.user,
        prioridades,
        coordinaciones,
        identificadores
    });
});

router.get('/crud-docente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const identificadores = await Docente.list();
    res.render('admins/docenteCrud', {
        user: req.user,
        identificadores
    });

});

router.get('/crud-prioridad', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const identificadores = await Prioridad.list();
    res.render('admins/prioridadCrud', {
        user: req.user,
        identificadores
    });

});

router.get('/crud-coordinacion', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const docentes = await Docente.list();
    const identificadores = await Coordinacion.list();
    res.render('admins/coordinacionCrud', {
        user: req.user,
        docentes,
        identificadores
    });

});

router.get('/crud-preguntafrecuente', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const identificadores = await PreguntaFrecuente.list();
    res.render('admins/preguntaFrecuenteCrud', {
        user: req.user,
        identificadores
    });

});

router.get('/crud-secretaria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const identificadores = await Secretaria.list();
    res.render('admins/secretariaCrud', {
        user: req.user,
        identificadores
    });

});

router.get('/reportes', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const criterios = ['Categoria', 'Tipo'];
    res.render('admins/reportes', {
        user: req.user,
        criterios
    });
});

router.get('/categoria-filtro/:categoria', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { categoria } = req.params;
    if (categoria === 'Todo') {
        const todo = await Solicitud.list();
        res.json(todo);
    } else {
        const solicitudes = await Solicitud.search(categoria, 'categoria');
        res.json(solicitudes);
    }

});

router.get('/prioridad-filtro/:prioridad', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { prioridad } = req.params;
    const solicitudes = await Solicitud.search(prioridad, 'prioridad');
    res.json(solicitudes);
});

router.get('/tipo-filtro/:tipo', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { tipo } = req.params;
    const solicitudes = await Solicitud.search(tipo, 'tipo');
    res.json(solicitudes);
});

router.get('/en-proceso', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const solicitudes = await Solicitud.search('en proceso', 'estado');
    res.json(solicitudes);

});

router.get('/atendido', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const solicitudes = await Solicitud.search('atendido', 'estado');
    res.json(solicitudes);
});

router.get('/enviado', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const solicitudes = await Solicitud.search('enviado', 'estado');
    res.json(solicitudes);
});

router.get('/report/:fechaI/:fechaF/:filtro', isLoggedIn, authRole(ROLES.ADMIN), async (req: Request, res: Response) => {
    const { fechaI, fechaF, filtro } = req.params;
    const fechaInicio = new Date(fechaI);
    const fechaFin = new Date(fechaF);
    const data = await Reporte.report(fechaInicio, fechaFin, filtro);
    res.json(data);
});

export default router;