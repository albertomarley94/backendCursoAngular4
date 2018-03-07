//"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath c:\data\db
//Requires -> Importación de librerias
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var serveIndex = require('serve-index')
//Models
require("./models/usuario");
require("./models/hospital");
require("./models/medico");
//Inicialización
var appRoutes = require("./routes/app");
var busquedaRoutes = require("./routes/busqueda");
var uploadRoutes = require("./routes/upload");
var imgRoutes = require("./routes/img");
var usuarioRoutes = require("./routes/usuario");
var loginRoutes = require("./routes/login");
var hospitalRoutes = require("./routes/hospital");
var medicoRoutes = require("./routes/medico");
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

//Serve index para ver imagenes
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//Routes - Siempre ruta padre abajo
app.use("/login",loginRoutes);
app.use("/usuario",usuarioRoutes);
app.use("/hospital",hospitalRoutes);
app.use("/medico",medicoRoutes);
app.use("/busqueda",busquedaRoutes);
app.use("/upload",uploadRoutes);
app.use("/img",imgRoutes);
app.use("/",appRoutes);

//Escuchar peticiones
app.listen(4211, ()=> {
    //ROJO -> \x1b[31m
    console.log('Express log \x1b[32m%s\x1b[0m',"4211");
});