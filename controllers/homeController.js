//ORM persistencia en la base de datos .net Linq dappler java hibernate (mapeo objeto relacional)
const mongoose = require('mongoose');
require('../config/db');
const Vacante = require('../models/Vacantes');


exports.mostrarTrabajos = async (request, response, next) => {

    const vacantes = await Vacante.find();

    if (!vacantes) return next();

    //Asocia con una vista de handlebars 'home'
    response.render('home', {
        nombrePagina: 'Plataforma De Trabajos',
        tagline: 'Trabajos para Desarrolladores by Brayan Andrés Medina',
        barra: true,
        boton: true,
        vacantes
    });
}

