import { isLoggedIn, upload } from "@config/util";
import express, { Router, Request, Response } from "express";
import { Solicitud } from "@models/solicitud";
import { Categoria } from "@models/categoria";
import { Mensaje } from "@models/mensaje";
import { Estudiante } from "@models/estudiante";
import { v4 } from "uuid";
import fs from "fs";
import FormData from "form-data";
import { Multimedia } from "@models/multimedia";
import { Tipo } from "@models/tipo";
import { promisify } from "util";
import path from "path";

const router: Router = express.Router();


const categoria = (rol : string) : string => {
    switch (rol) {
        case "practicas":
            return "coorPracticas";
        case "tutoria":
            return "coorTutoria";
        case "cisco":
            return "coorCisco";
        case "seguimiento":
            return "coorSeguimiento";
        case "admin":
            return "admin";
    }
}

router.get('/detalles/:id/:rol', isLoggedIn, async (req : Request, res : Response) => {

    const user : any = req.user;
    const solicitudRequest = await Solicitud.search(req.params.id, 'id');
    const solicitud = solicitudRequest[0];
    
    const estudiante = await Estudiante.search(solicitud.Estudiante, 'codigo');
    const mensajes = await Mensaje.search(solicitud.Id, 'solicitud');

    const coor : string = categoria(req.params.rol);
    res.render('admins/solicitud', {
        user,
        estudiante: estudiante[0],
        solicitud,
        mensajes,
        coordinacion: coor
    });

    
});

router.post('/nuevo-mensaje', isLoggedIn, upload.array('archivo-mensaje', 5), async (req : Request, res : Response) => {
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
        res.redirect(`/solicitud/detalles/${solicitudId}/${coordinacion}`);



    } catch (err) {
        res.redirect(`/solicitud/detalles/${solicitudId}/${coordinacion}`);
    }
});

export default router;