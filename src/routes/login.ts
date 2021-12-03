import express, { Router, Request, Response } from 'express';
import passport from 'passport';

const router : Router = express.Router();

router.get('/', (req : Request, res : Response) => {
    
    res.render('index');
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
    }
}


);

router.get('/logout', (req : Request, res : Response) => {
    req.logout();
    req.session.destroy(() => console.log('user logged out'));
    res.redirect('/');
});

export default router;