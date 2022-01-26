const passport = require('passport');
const mongoose = require('mongoose');
require('../config/db');
const Vacante= require('../models/Vacantes');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage: 'Todos los campos son obligatorios'
});

exports.mostrarPanel = async (request, response) =>{
    const vacantes = await Vacante.find({autor:request.user._id});

    response.render('administracion', {
        nombrePagina: 'Panel Administración',
        tagline: 'Crea y Administra Vacantes desde Aquí',
        cerrarSesion: true,
        nombre: request.user.nombre,
        imagen: request.user.imagen,
        vacantes 
    });
}

exports.validarUsuario=(request, response, next)=>{
    if(request.isAuthenticated()){
        return next();
    }
    response.redirect('/iniciar-sesion');
}

exports.cerrarSesion =(request, response)=>{
    request.logout();
    request.flash('correcto', 'Cerraste Sesión Correctamente');
    return response.redirect('/iniciar-sesion');
}