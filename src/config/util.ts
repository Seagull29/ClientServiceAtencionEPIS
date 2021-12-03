import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { v4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

export const isLoggedIn = (req : Request, res : Response, next : NextFunction) => {
    req.user ? next() : res.sendStatus(401);
};

export const links = {
    googleCallback: process.env.GOOGLE_CALLBACK || "http://localhost:3000/google/callback",
    apiDomain: process.env.API_DOMAIN || "http://localhost:5000/api" 
}

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
    admin: "lrivas"
}