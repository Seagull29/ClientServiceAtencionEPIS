import express, { Request, Response, Router } from "express";
import { isLoggedIn } from "@config/util";
import { Solicitud } from "@models/solicitud";

const router : Router = express.Router();

router.get('/', isLoggedIn, async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.list();
    res.render('admins/home', {
        user: req.user,
        solicitudes,
        coordinador: 'cisco'
    });
});

router.get('/consul/en-proceso', isLoggedIn, async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('en proceso', 'estado');
    const enProceso = solicitudes.filter(solicitud => solicitud.Estado === 'En proceso' && solicitud.Categoria === 'Academia CISCO');
    res.json(enProceso);

});

router.get('/consul/atendido', isLoggedIn, async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('atendido', 'estado');
    const atentidos = solicitudes.filter(solicitud => solicitud.Estado === 'Atendido' && solicitud.Categoria === 'Academia CISCO');
    res.json(atentidos);
});

router.get('/consul/consulta', isLoggedIn, async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('consulta', 'tipo');
    const consultas = solicitudes.filter(solicitud => solicitud.Tipo === 'Consulta' && solicitud.Categoria === 'Academia CISCO');
    res.json(consultas);
});

router.get('/consul/queja', isLoggedIn, async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('queja', 'tipo');
    const quejas = solicitudes.filter(solicitud => solicitud.Tipo === 'Queja' && solicitud.Categoria === 'Academia CISCO');
    res.json(quejas);
});

router.get('/consul/solicitud', isLoggedIn, async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('solicitud', 'tipo');
    const solis = solicitudes.filter(solicitud => solicitud.Tipo === 'Solicitud' && solicitud.Categoria === 'Academia CISCO');
    res.json(solis);
});

router.get('/consul/enviado', isLoggedIn, async (req : Request, res : Response) => {
    const solicitudes = await Solicitud.search('enviado', 'estado');
    const enviados = solicitudes.filter(solicitud => solicitud.Estado === 'Enviado' && solicitud.Categoria === 'Academia CISCO');
    res.json(enviados);
});



export default router;