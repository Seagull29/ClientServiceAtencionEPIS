import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import * as dotenv from "dotenv";
import { Estudiante } from "@models/estudiante"
import { encargados } from "@config/util";
import { Docente } from "@models/docente";
import { links } from "@config/util";

const googleStrategy = GoogleStrategy.Strategy;

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


passport.use(new googleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: links.googleCallback,
    },
    async (accessToken, refreshToken, profile, done) => {

        const { _json: user } = profile;
        const { hd, email } = user;
        const dominioUac: string = 'uandina.edu.pe';

        if (hd !== dominioUac) {
            return done(null, false);
        }
        //const coduac: string = email.slice(0, 9).concat(email.charAt(9).toUpperCase());
        const usuario: string = email.slice(0, email.length - dominioUac.length - 1);
        console.log(usuario);
        if (usuario === encargados.practicas) {
            const coordinador = await Docente.search(usuario, 'codigo');
            if (coordinador.length) {
                user.rol = {
                    coordinador: true,
                    rol: 'practicas'
                };
                user.code = usuario;
                return done(null, user);
            } else {
                return done(null, false);
            }
        } else if (usuario === encargados.tutoria) {
            const coordinador = await Docente.search(usuario, 'codigo');
            if (coordinador.length) {
                user.rol = {
                    coordinador: true,
                    rol: 'tutoria'
                };
                user.code = usuario;
                return done(null, user);
            } else {
                return done(null, false);
            }
        } else if (usuario === encargados.seguimiento) {
            const coordinador = await Docente.search(usuario, 'codigo');
            if (coordinador.length) {
                user.rol = {
                    coordinador: true,
                    rol: 'seguimiento'
                };
                user.code = usuario;
                return done(null, user);
            } else {
                return done(null, false);
            }
        } else if (usuario === encargados.cisco) {
            const coordinador = await Docente.search(usuario, 'codigo');
            if (coordinador.length) {
                user.rol = {
                    coordinador: true,
                    rol: 'cisco'
                };
                user.code = usuario;
                return done(null, user);
            } else {
                return done(null, false);
            }
        } else if (usuario === encargados.admin) {
            const coordinador = await Docente.search(usuario, 'codigo');
            if (coordinador.length) {
                user.rol = {
                    administrador: true,
                    rol: 'admin'
                };
                user.code = usuario;
                return done(null, user);
            } else {
                return done(null, false);
            }
        } else if (usuario === encargados.secretaria) {
            const coordinador = await Docente.search(usuario, 'codigo');
            if (coordinador.length) {
                user.rol = {
                    secretaria: true,
                    rol: 'secretaria'
                }
                user.code = usuario;
                return done(null, user);
            } else {
                return done(null, false);
            }
        } else {
            const estudiante = await Estudiante.search(usuario, 'codigo');

            if (estudiante.length === 0) {
                const { given_name, family_name } = user;
                const added = await Estudiante.add({
                    codigoUAC: usuario,
                    nombre: given_name,
                    apellidos: family_name,
                    grado: ''
                });
            }

            user.code = usuario;
            user.rol = {
                estudiante: true,
                rol: 'estudiante'
            };
            console.log("Agreagado o ya estaba: ", estudiante);
            return done(null, user);
        }

    }
));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

