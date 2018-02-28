var express = require("express");
//Inicialización
var app = express();
//Rutas
app.get("/",(request,response,next)=>{
    response.status(200).json({
        ok: true,
        mensaje: "Peticion realizada correctamente con nodemon"
    })
})

module.exports = app;