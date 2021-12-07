import express, { Router, Request, Response } from 'express';
import passport from 'passport';
import path from "path";
import fs from "fs";
import { PreguntaFrecuente } from '@models/preguntaFrecuente';
import { urlsAyuda } from '@config/util';

const router : Router = express.Router();

router.get('/', (req : Request, res : Response) => {
    
    res.render('index');
});


router.get('/preguntas-frecuentes', async (req : Request, res : Response) => {
    const preguntas = await PreguntaFrecuente.list();

    const preguntasF = preguntas.map(p => {
        const { Respuesta : respuesta, Pregunta : pregunta } = p;
        let existeLinks : boolean = false;
        let division : Array<string> = [];
        for (let i = 0; i < urlsAyuda.length; ++i) {
            if (respuesta.includes(urlsAyuda[i])) {
                existeLinks = true;
                division.push(respuesta.replace(urlsAyuda[i], ''));
                division.push(urlsAyuda[i]);
                break;
            } else {

            }
        }
        if (!existeLinks) {
            return {
                pregunta,
                respuesta,
            };
        } 
        return {
            pregunta,
            respuesta: division[0],
            enlace: division[1]
        };
    });
    
    res.render('preguntas', {
        preguntasF,
        user: req.user
    });
});

router.get('/auth/google', passport.authenticate('google', { 
    scope: ['email', 'profile']
}));


router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req : Request, res : Response) => {
    const user : any = req.user;
    if (user.rol.rol === 'estudiante') {
        res.redirect('/estudiante');
    }
    switch (user.rol.rol) {
        case 'practicas':
            res.redirect('/coorPracticas');
            break;
        case 'tutoria':
            res.redirect('/coorTutoria');
            break;
        case 'seguimiento':
            res.redirect('/coorSeguimiento');
            break;
        case 'cisco':
            res.redirect('/coorCisco');
            break;
        case 'admin':
            res.redirect('/admin');
            break;
        case 'secretaria':
            res.redirect('/secretaria');
            break;
    }
}


);

router.get('/logout', (req : Request, res : Response) => {
    const carpetaPublica : string = path.join(__dirname, '../../src/public/uploads');
    fs.readdir(carpetaPublica, (error, files) => {
        if (error) {
            console.log(error);
        }
        files.forEach(file => fs.unlink(path.join(carpetaPublica, file), (err) => console.log(err)));
    });
    req.logout();   
    req.session.destroy(() => console.log('user logged out'));
    res.redirect('/');
});

export default router;