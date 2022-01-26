const { request, response } = require('express');
const mongoose = require('mongoose');
require('../config/db');
const Vacante= require('../models/Vacantes');

//Formulario Inicial
exports.formularioNuevaVacante = (request, response)=>{
    //response.send('Funciona');
    response.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline:'Llena el formulario y publica Vacantes :)',
        cerrarSesion: true,
        nombre: request.user.nombre,
        imagen: request.user.imagen
    })
}
//Formulario Inserción
exports.agregarVacante = async (request, response)=>{
    const vacante = new Vacante(request.body);

    vacante.autor = request.user._id;

    //console.log(vacante);

    vacante.skills = request.body.skills.split(',');

    const nuevaVacante = await vacante.save()

    response.redirect(`/vacantes/${nuevaVacante.url}`);
}

//Muestra una vacante
exports.mostrarVacante = async (request, response, next)=>{

    const vacante = await Vacante.findOne({url: request.params.url}).populate('autor');

    console.log(vacante);
             
    if(!vacante) return next();

    response.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true 
    })

}

exports.formularioEditarVacante = async(request, response, next)=>{
    const vacante = await Vacante.findOne({url:request.params.url});

    if(!vacante) return next();

    response.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar-${vacante.titulo}`,
        cerrarSesion: true,
        nombre: request.user.nombre,
        imagen: request.user.imagen
    })


}

exports.editarVacante = async (request, response)=>{

    const vacanteActualizada = request.body;
    
    vacanteActualizada.skills=request.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({url:request.params.url}, vacanteActualizada,{
        new:true,
        runValidators: true
    });

    response.redirect(`/vacantes/${vacante.url}`);
}

exports.validarVacante = (request, response, next) =>{
    //Sanitizar Campos
    request.sanitizeBody('titulo').escape();
    request.sanitizeBody('empresa').escape();
    request.sanitizeBody('ubicacion').escape();
    request.sanitizeBody('salario').escape();
    request.sanitizeBody('contrato').escape();
    request.sanitizeBody('skills').escape();

    //Validar
    request.checkBody('titulo', 'Debe ingresar un título de vacante').notEmpty();
    request.checkBody('empresa', 'Debe ingresar una Empresa Legal').notEmpty();
    request.checkBody('ubicacion', 'Debe ingresar una ubicación de trabajo').notEmpty();
    request.checkBody('contrato', 'Debe ingresar el tipo de contrato').notEmpty();
    request.checkBody('skills', 'Debe seleccionar alguna Skill').notEmpty();

    const errores = request.validationErrors();

    if(errores){
        request.flash('error', errores.map(error=>error.msg));

        response.render('nueva-vacante', {
            nombrePagina: 'Nueva Vacante',
            tagline:'Llena el formulario y publica Vacantes :)',
            cerrarSesion: true,
            nombre: request.user.nombre,
            mensajes:request.flash()
        })
    }

    next();
 
}

exports.eliminarVacante = async(request, response) =>{
    const {id}= request.params;

    //console.log(id);

    const vacante = await Vacante.findById(id);

    if(verificarAutor(vacante, request.user)){
        vacante.remove();
        response.status(200).send('Vacante eliminada Correctamente');
    }else{

        response.status(403).send('Error no se ha podido Eliminar la Vacante!');
    }
 
}

const verificarAutor =(vacante ={}, usuario={})=>{
    if(!vacante.autor.equals(usuario._id)){
        return false;
    }

    return true;
}
