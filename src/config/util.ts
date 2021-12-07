import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { v4 } from "uuid";
import * as dotenv from "dotenv";
import { Session } from "express-session";

dotenv.config();

export const isLoggedIn = (req : Request, res : Response, next : NextFunction) => {
    req.user ? next() : res.sendStatus(401);
};

export const links = {
    googleCallback: process.env.GOOGLE_CALLBACK || "http://localhost:3000/google/callback",
    apiDomain: process.env.API_DOMAIN || "http://localhost:5000/api" 
};

export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../../src/public/uploads'));
        },
        filename: (req, file, cb) => {
            const { originalname } = file;
            const id = v4() + Date.now() + originalname.charAt(originalname.length - 1) + path.extname(file.originalname);
            cb(null, id);
        }
    }),
    dest: path.join(__dirname, '../../src/public/uploads'),
    limits: {
        fileSize: 5 * 1000 * 1000
    }
});

export const encargados = {
    practicas: "hespetia",
    tutoria: "ybernales",
    seguimiento: "ealcca",
    cisco: "lsota",
    admin: "lrivas",
    secretaria: "jcalsin"
};



export const urlsAyuda = [
    'https://sites.google.com/uandina.edu.pe/ingenieriadesistemas/documentos-de-interes-EPIS?authuser=0',
    'https://www.uandina.edu.pe/ingenieria-sistemas/#1613233224579-493c43cd-e334',
    'https://www.uandina.edu.pe/directorio-telefonico/', 
    'https://sites.google.com/uandina.edu.pe/ingenieriadesistemas/informacion-de-apoyo?authuser=0'
];
    

/*
export const descargar = async (req : Request, res : Response) => {
    const { id } = req.params;
    const pedido = await Multimedia.search(id, 'id');
    const archivo = pedido[0];
    const carpetaPublica : string = path.join(__dirname, '../../src/public/uploads');
    const nombreCompleto : string = archivo.Id.concat(path.extname(archivo.Nombre));
    const direccion : string = `${carpetaPublica}/${nombreCompleto}`;
    fs.writeFileSync(direccion, Buffer.from(archivo.Archivo)); 
    const tiposAceptados = /jpeg|jpg|png|pdf/;
    res.download(direccion);
};*/
/*
interface SessionDocuments extends Session {
    documentsSession? : Array<any>;
}

export const documentsMiddle = (req : Request, res : Response, next : NextFunction) => {
    const documentsSession : SessionDocuments = req.session;
    req.session = documentsSession;
    next()
}*/