import express, { Request, Response, Router } from "express";
import { isLoggedIn, upload } from "@config/util";
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

const router: Router = express.Router();

router.get('/', isLoggedIn, async (req: Request, res: Response) => {
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

router.get('/solicitud/detalles/:id', isLoggedIn, async (req: Request, res: Response) => {

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

router.get('/descarga/:id', isLoggedIn, async (req: Request, res: Response) => {
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

router.post('/solicitud/nuevo-mensaje', isLoggedIn, upload.array('archivo-mensaje', 5), async (req: Request, res: Response) => {
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

router.post('/agregar-categoria', isLoggedIn, async (req: Request, res: Response) => {
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
    res.redirect('/admin/control');
});

router.post('/actualizar-categoria', isLoggedIn, async (req: Request, res: Response) => {
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

    res.redirect('/admin/control');
});

router.post('/eliminar-categoria', isLoggedIn, async (req: Request, res: Response) => {
    const { txtId : id } = req.body;
    const eliminado = await Categoria.delete({
        id
    });
    res.redirect('/admin/control');
});

router.get('/listar-categoria', isLoggedIn, async (req: Request, res: Response) => {
    const categorias = await Categoria.list();
    res.json(categorias);
});

router.get('/solicitud/cerrar/:id', isLoggedIn, async (req: Request, res: Response) => {
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

router.get('/control', isLoggedIn, async (req: Request, res: Response) => {
    res.render('admins/admin', {
        user: req.user
    });
});

router.get('/crud-tipo', isLoggedIn, async (req: Request, res: Response) => {
    const carpetaPublica: string = path.join(__dirname, '../../src/views/admins');
    res.sendFile(`${carpetaPublica}/tipoCrud.hbs`);

});

router.get('/crud-categoria', isLoggedIn, async (req: Request, res: Response) => {
    const carpetaPublica: string = path.join(__dirname, '../../src/views/admins');
    res.sendFile(`${carpetaPublica}/categoriaCrud.hbs`);

});

router.get('/crud-docente', isLoggedIn, async (req: Request, res: Response) => {
    const carpetaPublica: string = path.join(__dirname, '../../src/views/admins');
    res.sendFile(`${carpetaPublica}/docenteCrud.hbs`);

});

router.get('/crud-prioridad', isLoggedIn, async (req: Request, res: Response) => {
    const carpetaPublica: string = path.join(__dirname, '../../src/views/admins');
    res.sendFile(`${carpetaPublica}/prioridadCrud.hbs`);

});

router.get('/crud-coordinacion', isLoggedIn, async (req: Request, res: Response) => {
    const carpetaPublica: string = path.join(__dirname, '../../src/views/admins');
    res.sendFile(`${carpetaPublica}/coordinacionCrud.hbs`);

});

router.get('/crud-preguntafrecuente', isLoggedIn, async (req: Request, res: Response) => {
    const carpetaPublica: string = path.join(__dirname, '../../src/views/admins');
    res.sendFile(`${carpetaPublica}/preguntaFrecuenteCrud.hbs`);

});

router.get('/crud-secretaria', isLoggedIn, async (req: Request, res: Response) => {
    const carpetaPublica: string = path.join(__dirname, '../../src/views/admins');
    res.sendFile(`${carpetaPublica}/secretariaCrud.hbs`);

});

router.get('/categoria-filtro/:categoria', isLoggedIn, async (req: Request, res: Response) => {
    const { categoria } = req.params;
    if (categoria === 'Todo') {
        const todo = await Solicitud.list();
        res.json(todo);
    } else {
        const solicitudes = await Solicitud.search(categoria, 'categoria');
        res.json(solicitudes);
    }

});

router.get('/prioridad-filtro/:prioridad', isLoggedIn, async (req: Request, res: Response) => {
    const { prioridad } = req.params;
    const solicitudes = await Solicitud.search(prioridad, 'prioridad');
    res.json(solicitudes);
});

router.get('/tipo-filtro/:tipo', isLoggedIn, async (req: Request, res: Response) => {
    const { tipo } = req.params;
    const solicitudes = await Solicitud.search(tipo, 'tipo');
    res.json(solicitudes);
});

router.get('/en-proceso', isLoggedIn, async (req: Request, res: Response) => {
    const solicitudes = await Solicitud.search('en proceso', 'estado');
    res.json(solicitudes);

});

router.get('/atendido', isLoggedIn, async (req: Request, res: Response) => {
    const solicitudes = await Solicitud.search('atendido', 'estado');
    res.json(solicitudes);
});


router.get('/enviado', isLoggedIn, async (req: Request, res: Response) => {
    const solicitudes = await Solicitud.search('enviado', 'estado');
    res.json(solicitudes);
});

export default router;