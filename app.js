//"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath c:\data\db
//Requires -> Importación de librerias
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser')

//Inicialización
var appRoutes = require("./routes/app")
var usuarioRoutes = require("./routes/usuario")
var loginRoute = require("./routes/login")
var app = express();

//BodyParser xxx urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Conexión a db
mongoose.connect("mongodb://localhost:27017/hospitalDB",(err , resp)=>{
    if(err){
        throw err;
    }else{
        console.log('Conectado a DB \x1b[32m%s\x1b[0m',"27017");
    }
})

//Routes - Siempre ruta padre abajo
app.use("/login",loginRoute);
app.use("/usuario",usuarioRoutes);
app.use("/",appRoutes);
//Escuchar peticiones
app.listen(4211, ()=> {

    //ROJO -> \x1b[31m
    console.log('Express log \x1b[32m%s\x1b[0m',"4211");
    
});