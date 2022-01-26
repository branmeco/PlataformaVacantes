//Importanción express para control de rutas o URL
const express = require('express');
//Llamar el método que controla las rutas => Router
const router = express.Router();

//Importar el controlador de Home
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');


//Mejorar las peticiones al servidor
module.exports = () =>{
    router.get('/', homeController.mostrarTrabajos);

    router.get('/vacantes/nueva', 
    authController.validarUsuario,
    vacantesController.formularioNuevaVacante);

    router.post('/vacantes/nueva', 
    authController.validarUsuario,
    vacantesController.validarVacante,
    vacantesController.agregarVacante);

    //Mostrando Vacantes por cada Una
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    //Editar vacantes
    router.get('/vacantes/editar/:url', 
    authController.validarUsuario,
    vacantesController.formularioEditarVacante);

    //Guardar Edición
    router.post('/vacantes/editar/:url', 
    authController.validarUsuario,
    vacantesController.validarVacante,
    vacantesController.editarVacante);

    //Eliminar Vacantes
    router.delete('/vacantes/eliminar/:id',
    authController.validarUsuario,
    vacantesController.eliminarVacante);

    //Crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    
    router.post('/crear-cuenta', 
    usuariosController.validarRegistro,
    usuariosController.crearUsuario);

    //Iniciar Sesión - Mostrar vista
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    //Inciar Sesión - Validación passport - Post Autenticación
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Cerrar Sesión
    router.get('/cerrar-sesion', 
    authController.validarUsuario, 
    authController.cerrarSesion);

    //Panel de administración
    router.get('/administracion', 
    authController.validarUsuario,
    authController.mostrarPanel);

    //Editar Perfil
    router.get('/editar-perfil', 
    authController.validarUsuario,
    usuariosController.formEditarPerfil)

    router.post('/editar-perfil', 
    authController.validarUsuario, 
    //usuariosController.validarPerfil,
    usuariosController.subirImagen,
    usuariosController.editarPerfil);

    
    return router;
}