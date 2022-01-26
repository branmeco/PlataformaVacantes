const { request, response } = require('express');
const mongoose = require('mongoose');
require('../config/db');
const Usuarios= require('../models/Usuarios');
const multer = require('multer');
const shortid = require('shortid');

exports.subirImagen =(request, response, next)=>{
    /*upload(request, response, function(error){
        if(error instanceof multer.MulterError){
            return next();
        }
    });
    next();*/
    upload(request, response, function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code==='LIMIT_FILE_SIZE'){
                    request.flash('error', 'El archivo es muy grande, máximo 100kb');
                }else{
                    request.flash('error', error.message);
                }
            }else{
                request.flash('error', error.message);
            }
            response.redirect('/administracion');
            return;
        }else{
            return next();
        }
    });
    
}

const configuracionMulter = {
    limits:{fileSize: 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (request, file, cb)=>{
            cb(null, __dirname+'../../public/uploads/perfiles');
        },
        filename:(request, file, cb)=>{
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter (request, file, cb){
        if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
            cb(null, true);
        }else{
            cb(new Error('No es el formato Pedido'), false);
        }
    }
    
}

const upload= multer(configuracionMulter).single('imagen');


exports.formCrearCuenta = (request, response)=>{
   response.render('crear-cuenta',{
       nombrePagina: 'Crea tu Cuenta Gratis',
       tagline: 'Publica tus vacantes gratis, Solo debes crear una cuenta'
   }) 
}

exports.validarRegistro = (request, response, next)=>{
    //Sanitizar
    request.sanitizeBody('nombre').escape();
    request.sanitizeBody('email').escape();
    request.sanitizeBody('password').escape();
    request.sanitizeBody('confirmar').escape();

    //validar
    request.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
    request.checkBody('email', 'El email debe ser válido').isEmail();
    request.checkBody('password', 'El password no puede ir vacío').notEmpty();
    request.checkBody('confirmar', 'Confirmar Password no puede ir vacío').notEmpty();
    request.checkBody('confirmar', 'El Password es diferente').equals(request.body.password);
    
    const errores = request.validationErrors();

    //Validar errores
    if(errores){
        request.flash('error', errores.map(error => error.msg));

        response.render('crear-cuenta',{
                nombrePagina: 'Crea tu Cuenta Gratis',
                tagline: 'Publica tus vacantes gratis, Solo debes crear una cuenta',
                mensajes: request.flash(),
                }
        );
        
    }
    //Si no hay errores - Guardar
    next();
    
}

exports.crearUsuario = async (request, response, next)=>{
    const usuario = new Usuarios(request.body);

    const errores = request.validationErrors();
    //console.log(usuario);

    //return;
    if (!errores) {
        try {
            await usuario.save();
            request.flash('correcto', 'Se ha creado el usuario!');
            response.redirect('/iniciar-sesion');

        } catch (error) {
            console.log(error);
            request.flash('error', error);
            response.redirect('/crear-cuenta');
        }
    }
}

exports.formIniciarSesion =(request, response)=>{
    response.render('iniciar-sesion', {
        nombrePagina:'Iniciar Sesión'
    });
}


//Abrir la página y pasarle datos o valores
exports.formEditarPerfil = (request, response)=>{

    response.render('editar-perfil',{
        nombrePagina: 'Edita tu perfil de la Plataforma',
        cerrarSesion: true,
        nombre: request.user.nombre,
        usuario: request.user,
        imagen: request.user.imagen
    });
}

//interaccion con la base de datos save
exports.editarPerfil = async(request, response)=>{

    const usuario = await Usuarios.findById(request.user._id);
    //console.log(usuario);
    usuario.nombre = request.body.nombre;

    usuario.email = request.body.email;

    if(request.body.password){
        usuario.password = request.body.password;
    }

    if(request.file){
        usuario.imagen = request.file.filename;
    }
    
    await usuario.save();

    request.flash('correcto', 'Cambios Guardados Correctamente');

    response.redirect('/administracion');
}

exports.validarPerfil = (request, response, next)=>{
    //Sanitizar
    request.sanitizeBody('nombre').escape();
    request.sanitizeBody('email').escape();

    if(request.body.password){

        request.sanitizeBody('password').escape();

    }
    //Validar
    request.checkBody('nombre', 'Debe Agregar un nombre').notEmpty();
    request.checkBody('email', ' Debe colocar un correo válido').notEmpty();

    const errores = request.validationErrors();

    if(errores){
        request.flash('error', errores.map(error => error.msg));

        response.render('editar-perfil',{
            nombrePagina: 'Edita tu perfil de la Plataforma',
            cerrarSesion: true,
            nombre: request.user.nombre,
            usuario: request.user,
            mensajes: request.flash()
        })

    }
    next();
}