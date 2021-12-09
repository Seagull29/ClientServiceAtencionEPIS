import { isLoggedIn, upload } from "@config/util";
import express, { Router, Request, Response } from "express";
import { Solicitud } from "@models/solicitud";
import { Categoria } from "@models/categoria";
import { Estudiante } from "@models/estudiante";
import { Mensaje } from "@models/mensaje";
import { v4 } from "uuid";
import fs from "fs";
import FormData from "form-data";
import { Multimedia } from "@models/multimedia";
import { Tipo } from "@models/tipo";
import { promisify } from "util";
import path from "path";

const router: Router = express.Router();

router.get('/', isLoggedIn, async (req: Request, res: Response) => {
    const user: any = req.user;
    const { code } = user;
    const helpingQueries = await Solicitud.search(code, 'estudiante');
    user.helpingQueries = helpingQueries;
    res.render('students/home', {
        user
    });
});

router.get('/nueva-solicitud', isLoggedIn, async (req: Request, res: Response) => {
    const categorias = await Categoria.list();
    const tipos = await Tipo.list();
    //console.log(categorias);
    res.render('students/newRequest', {
        user: req.user,
        categorias,
        tipos
    });
});

router.post('/crear-solicitud', isLoggedIn, upload.array('archivos', 10), async (req: Request, res: Response) => {

    try {
        const { encabezado, descripcion, categoria, tipo } = req.body;
        const files: any = req.files;
        const user: any = req.user;

        const cat = await Categoria.search(categoria, 'nombre');
        const tip = await Tipo.search(tipo, 'nombre');

        const today = new Date();
        today.setHours(today.getHours() - 5);

        // proceso 
        const added: any = await Solicitud.add({
            id: Date.now() + v4() + user.code.slice(0, 2),
            encabezado,
            descripcion,
            estado: 'Enviado',
            fecha: today,
            categoria: cat[0].Id,
            tipo: tip[0].Id,
            estudiante: user.code
        });


        if (added && files.length) {

            const filesToAdd = files.map(file => {
                const formData = new FormData();
                const fileId = file.filename.slice(0, -path.extname(file.filename).length);
                formData.append('id', fileId);
                formData.append('nombre', file.originalname);
                formData.append('extension', file.mimetype);
                formData.append('archivo', fs.readFileSync(file.path), file.filename);
                formData.append('solicitud', added.added.id);
                return formData;
            });

            filesToAdd.forEach(async file => {
                const recentAdded = await Multimedia.add(file, file.getHeaders());
            });
            const unlinkAsync = promisify(fs.unlink);
            files.forEach(async file => await unlinkAsync(file.path));
        } 
        res.redirect('/estudiante');
    } catch (err) {
        res.redirect('/estudiante');    
    }
    
});



router.get('/solicitud/detalles/:id', isLoggedIn, async (req : Request, res : Response) => {

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
        /*const archivos = archivoSolicitud.map(archivo => {
            const nombreCompleto = archivo.Id.concat(path.extname(archivo.Nombre));
            archivo.abrir = nombreCompleto;
            fs.writeFile(`${carpetaPublica}/${nombreCompleto}`, Buffer.from(archivo.Archivo), e => console.log(e));
            return archivo;
        });*/
        solicitud.archivos = archivoSolicitud;
    } else {
        solicitud.tieneArchivos = false;
    }

    //console.log(archivoSolicitud);

    const archivosMensajes = mensajes.map(mensaje => {
        const { Id } = mensaje;
        const matchMultimedia = multimedia.filter(archivo => archivo.Mensaje === Id);
        //const multimedia =  Multimedia.search(Id, 'mensaje');
        const mensajeCompleto = {
            ...mensaje
        };
        if (matchMultimedia.length) {
            mensajeCompleto.tieneArchivos = true;
            /*
            const archivos = matchMultimedia.map(archivo => {
                const nombreCompleto = archivo.Id.concat(path.extname(archivo.Nombre));
                archivo.abrir = nombreCompleto;
                fs.writeFile(`${carpetaPublica}/${nombreCompleto}`, Buffer.from(archivo.Archivo), e => console.log(e)); 
                return archivo;
            });*/
            mensajeCompleto.archivos = matchMultimedia;
            

        } else {

            mensajeCompleto.tieneArchivos = false;
        }
        return mensajeCompleto;
    });

    let estado : boolean = solicitud.Estado === 'Atendido' ? false : true;

    res.render('students/solicitud', {
        user,
        estado,
        estudiante: estudiante[0],
        solicitud,
        archivosMensajes
    });
    
});


router.get('/descarga/:id', isLoggedIn, async (req : Request, res : Response) => {
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



router.post('/solicitud/nuevo-mensaje', isLoggedIn, upload.array('archivo-mensaje', 5), async (req : Request, res : Response) => {
    const { mensaje, solicitudId } = req.body;
    const user : any = req.user;
    try {
        const files : any = req.files;
        const user : any = req.user;

        const today = new Date();
        today.setHours(today.getHours() - 5);

        const nuevoMensaje = await Mensaje.add({
            id: Date.now() + v4() + user.code.slice(0, 2),
            cuerpo: mensaje,
            fecha: today,
            solicitud: solicitudId,
            estudiante: user.code
        });
    
        console.log(nuevoMensaje);
        console.log("llegue hasta aqui");

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
            res.redirect(`/estudiante/solicitud/detalles/${solicitudId}`);
        }, 1500);



    } catch (err) {
        res.redirect(`/estudiante/solicitud/detalles/${solicitudId}`);
    }
});



export default router;