const mongoose = require('mongoose');
require('./config/db');

//Importación de la librería para servidor
const { request, response } = require('express');
const express = require('express');
const router = require('./routes');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');

//Firmar las sesiones y poderlas guardar en mongo
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const bodyParser = require('body-parser');
//Agregar librerías para Sanitizar datos de entrada
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passport');

//Asociar las variables.env
require('dotenv').config({path:'variables.env'});

//Asociar express a una variable de trabajo local
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Validación de campos expressvalidator / 6 de la librería
app.use(expressValidator());

//Asociar Handlebars Template Engine
app.engine('handlebars', exphbs({defaultLayout:'layout', helpers: require('./helpers/handlebars'), handlebars: allowInsecurePrototypeAccess(Handlebars)}));

//Asocie a la vistas de mi applicación (Handlebars)
app.set('view engine','handlebars');

//Asociar carpeta public con css
app.use(express.static(path.join(__dirname, 'public')));

//Abrimos sesión con cookieParser
app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl:process.env.DATABASE})
}));

//Uso de passport
app.use(passport.initialize());
app.use(passport.session());

//Alertas y flash messages
app.use(flash());

//Crear nuestro middleware
app.use((request, response, next)=> {
    response.locals.mensajes = request.flash();
    next();
});

//Construir el servidor
app.use('/', router());

//Puerto para el servidor
app.listen(process.env.PUERTO);