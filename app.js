//Requires -> Importación de librerias
var express = require("express");
var mongoose = require("mongoose");

//Inicialización
var app = express();

//Conexión a db
mongoose.connect("mongodb://localhost:27017/hospitalDB",(err , resp)=>{
    if(err){
        throw err;
    }else{
        console.log('Conectado a DB \x1b[32m%s\x1b[0m',"27017");
    }
})
//Rutas
app.get("/",(request,response,next)=>{
    response.status(200).json({
        ok: true,
        mensaje: "Peticion realizada correctamente con nodemon"
    })
})
//Escuchar peticiones
app.listen(4211, ()=> {

    //ROJO -> \x1b[31m
    console.log('Express log \x1b[32m%s\x1b[0m',"4211");
    
});