const express = require('express');
const router = express.Router();
//cuando solo voy a importar un unico archivo lo llamo directamente service 
const service = require('../../models/citasModel');
//getCita -> para editar, getCitas -> para listar

// LAS RUTAS CON MAS JERARQUIA (CON MAS /) VAN MAS ARRIBA
/* Borrar una cita */
router.get('/baja/:id', async(req,res)=>{
    try {
        // esto tendria que ser un objeto XML HTTPRequest
        const {id} = req.params;
        const resultado =  await service.update(id,{estado:0});
        //lo unico que quiero recargar es la fila que acabo de eliminar de las citas
        res.redirect('/admin/citas');
    } catch (error) {
        
    }
});

/* /admin/citas/alta*/
router.get('/alta', (req,res)=>{
    res.render('admin/altaCita',{title: 'Subir una cita'});
});

/* Publicar una nueva cita*/
router.post('/alta', async (req,res)=>{
    try {
        const {autor,cita,libro} = req.body;
        const obj ={
            id_usuario: 1, // esto lo voy a tener que cambiar por el usuario que este logueado
            autor: autor,
            cita: cita,
            libro: libro
        };
        console.log(obj);
        const resultado = await service.create(obj);
        console.log(`el insertId es ${resultado}`);
        res.render('admin/altaCita',{message: 'Cita subida correctamente'});
        
    } catch (error) {
        res.render('admin/altaCita',{message: error});
    }
});

/* Cargar todas las citas */
router.get('/', async(req,res)=>{
    /*las ventajas de las funciones asincronicas, 
    ademas de que permite que una funcion se ejecute antes que otra es que permite usar el try catch
    */
   if(req.session.idUsuario != null){
       try {
           const citas = await service.getCitas();
           // [{}] returna un array de objetos
           // console.log(citas);
           res.render('admin/adminCitas',{citas});
       } catch (error) {
           console.log(error);
       }
   }else{
        res.send("Debe loguearse para agregar una cita");
   }
});

module.exports = router;