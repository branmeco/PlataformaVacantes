import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', ()=>{
    const skills = document.querySelector('.lista-conocimientos');

    let alertas = document.querySelector('.alertas');

    if(alertas){
        limpiarAlertas();
    }

    if(skills){
        skills.addEventListener('click', agregarSkills);
        skillsSeleccionadas();
    }

    const vacantesListado = document.querySelector('.panel-administracion');

    if(vacantesListado){

        vacantesListado.addEventListener('click', accionesListado);
    }
});

const skills = new Set();
const agregarSkills = e =>{
    if(e.target.tagName==='LI'){
        //console.log('si');
        if(e.target.classList.contains('activo')){
            //quitar del set y la clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            //agregar al set  y agregar la clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    //console.log(skills);
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionadas=()=>{
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    //console.log(seleccionadas);

    seleccionadas.forEach(seleccionada=>{
        skills.add(seleccionada.textContent);
    })

    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const limpiarAlertas = () =>{
    const alertas = document.querySelector('.alertas');

    const interval = setInterval(() => {
        if(alertas.children.length >0){
            alertas.removeChild(alertas.children[0]);
        }else if(alertas.children.length===0){
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);
}

const accionesListado = e=>{
    e.preventDefault();
    //console.log(e.target);
    if(e.target.dataset.eliminar){
        Swal.fire({
            title: 'Esta Seguro que desea Eliminar la vacante?',
            text: "Estos cambios no se pueden deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar Vacante!',
            cancelButton: 'No!, cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

                //url eliminar
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                console.log(url);

                //Axios
                axios.delete(url, {params:{url}})
                    .then(function(respuesta){
                        //console.log(respuesta);

                        if(respuesta.status===200){
                            Swal.fire(
                                'Vacante Eliminada!',
                                'Su Vacante ha sido eliminada',
                                'success',
                                respuesta.data
                              );

                              //eliminar la vacante del DOM
                              e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);

                        }
                    }).
                    catch(()=>{
                        Swal.fire({
                            type:'error',
                            title:'Hubo un error al Eliminar Vacante',
                            text:'No se pudo eliminar la vacante'
                        })
                    })
            }
          })
    }else if(e.target.tagName==='A'){
        window.location.href = e.target.href;
    }
}