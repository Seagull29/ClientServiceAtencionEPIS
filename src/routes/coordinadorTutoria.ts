import express, { Request, Response, Router } from "express";
import { isLoggedIn, upload, ROLES, authRole } from "@config/util";
import { Solicitud } from "@models/solicitud";
import { Estudiante } from "@models/estudiante";
import { Mensaje } from "@models/mensaje";
import { v4 } from "uuid";
import { promisify } from "util";
import { Multimedia } from "@models/multimedia";
import { Prioridad } from "@models/prioridad";
import { Tipo } from "@models/tipo";
import FormData from "form-data";
import fs from "fs";
import path from "path";


const router : Router = express.Router();

router.get('/', isLoggedIn, authRole(ROLES.CTUTORIA), async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('tutoria', 'categoria');
    const prioridades = await Prioridad.list();
    const tipos = await Tipo.list();
    res.render('coorTutoria/tutoria', {
        user: req.user,
        solicitudes,
        prioridades,
        tipos,
        coordinador: 'tutoria'
    });
});

router.get('/solicitud/detalles/:id', isLoggedIn, authRole(ROLES.CTUTORIA), async (req : Request, res : Response) => {

    const user : any = req.user;
    const solicitudRequest = await Solicitud.search(req.params.id, 'id');
    const solicitud = solicitudRequest[0];
    
    const estudiante = await Estudiante.search(solicitud.Estudiante, 'codigo');
    const mensajes = await Mensaje.search(solicitud.Id, 'solicitud');

    const archivoSolicitud = await Multimedia.search(solicitud.Id, 'solicitud');
    const multimedia = await Multimedia.list();

    const carpetaPublica : string = path.join(__dirname, '../../src/public/uploads');

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

    res.render('coorTutoria/solicitud', {
        user,
        estudiante: estudiante[0],
        solicitud,
        archivosMensajes
    });

    
});

router.get('/descarga/:id', isLoggedIn, authRole(ROLES.CTUTORIA), async (req : Request, res : Response) => {
    const { id } = req.params;
    const pedido = await Multimedia.search(id, 'id');
    const archivo = pedido[0];
    const carpetaPublica : string = path.join(__dirname, '../../src/public/uploads');
    const nombreCompleto : string = archivo.Id.concat(path.extname(archivo.Nombre));
    const direccion : string = `${carpetaPublica}/${nombreCompleto}`;
    fs.writeFileSync(direccion, Buffer.from(archivo.Archivo)); 
    const tiposAceptados = /jpeg|jpg|png|pdf/;
    res.download(direccion);
    
});

router.post('/solicitud/nuevo-mensaje', isLoggedIn, authRole(ROLES.CTUTORIA), upload.array('archivo-mensaje', 5), async (req : Request, res : Response) => {
    const { mensaje, solicitudId, coordinacion } = req.body;
    const user : any = req.user;
    try {
        const solicitudRequest = await Solicitud.search(solicitudId, 'dev');
        const solicitud = solicitudRequest[0];
        const files : any = req.files;
        const user : any = req.user;

        const today = new Date();
        today.setHours(today.getHours() - 5);

        const updated : any = await Solicitud.update({
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
            res.redirect(`/coorTutoria/solicitud/detalles/${solicitudId}`);
        }, 1500);



    } catch (err) {
        res.redirect(`/coorTutoria/solicitud/detalles/${solicitudId}`);
    }
});

router.get('/solicitud/cerrar/:id', isLoggedIn, authRole(ROLES.CTUTORIA), async (req: Request, res: Response) => {
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
    res.redirect('/coorTutoria');

});

router.get('/prioridad-filtro/:prioridad', isLoggedIn, authRole(ROLES.CTUTORIA), async (req : Request, res : Response) => {
    const { prioridad } = req.params;
    const solicitudes = await Solicitud.search(prioridad, 'prioridad');
    const tipos = solicitudes.filter(solicitud =>  solicitud.Categoria === 'Tutoria');
    res.json(tipos);
});

router.get('/tipo-filtro/:tipo', isLoggedIn, authRole(ROLES.CTUTORIA), async (req : Request, res : Response) => {
    const { tipo } = req.params;
    const solicitudes = await Solicitud.search(tipo, 'tipo');
    const tipos = solicitudes.filter(solicitud =>  solicitud.Categoria === 'Tutoria');
    res.json(tipos);
});

router.get('/en-proceso', isLoggedIn, authRole(ROLES.CTUTORIA), async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('en proceso', 'estado');
    const enProceso = solicitudes.filter(solicitud => solicitud.Estado === 'En proceso' && solicitud.Categoria === 'Tutoria');
    res.json(enProceso);

});

router.get('/atendido', isLoggedIn, authRole(ROLES.CTUTORIA), async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('atendido', 'estado');
    const atentidos = solicitudes.filter(solicitud => solicitud.Estado === 'Atendido' && solicitud.Categoria === 'Tutoria');
    res.json(atentidos);
});

router.get('/enviado', isLoggedIn, authRole(ROLES.CTUTORIA), async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('enviado', 'estado');
    const enviados = solicitudes.filter(solicitud => solicitud.Estado === 'Enviado' && solicitud.Categoria === 'Tutoria');
    res.json(enviados);
});

export default router;