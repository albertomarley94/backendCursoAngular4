var express = require("express");
var app = express();
//File system de node
const fs = require('fs');

app.get('/:tipo/:img',(req,res)=>{
    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./uploads/${tipo}/${img}`

    fs.exists(path,(existe)=>{
        if(!existe){
            path = `./assets/no-img.jpg`
        }
        return res.sendfile(path);
    });

    
})
module.exports = app;