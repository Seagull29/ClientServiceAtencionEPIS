import 'module-alias/register';
import express, { Application } from "express";
import * as dotenv from "dotenv";
import hbsTemplate from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import login from "@routes/login";
import student from "@routes/student";
import coorPracticas from "@routes/coordinadorPracticas";
import coorTutoria from "@routes/coordinadorTutoria";
import coorCisco from "@routes/coordinadorCisco";
import coorSeguimiento from "@routes/coordinadorSeguimiento";
import admin from "@routes/admin";
require("@config/authorization");
const path = require("path");


dotenv.config();

const app : Application = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../src/views'));

app.engine('hbs', hbsTemplate({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs',
    helpers: {
        math: (lvalue, operator, rvalue) => {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue
            } [operator];
        }
    }
}));

app.set('view engine', 'hbs');


app.use(express.urlencoded({ extended: true}));
app.use(session({   
    secret: 'EPIS',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../src/public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', login);
app.use('/estudiante', student);
app.use('/coorPracticas', coorPracticas);
app.use('/coorTutoria', coorTutoria);
app.use('/coorCisco', coorCisco);
app.use('/coorSeguimiento', coorSeguimiento);
app.use('/admin', admin);

app.listen(app.get('port'), () => {
    console.log(`Server's running on port ${app.get('port')}`);
});

