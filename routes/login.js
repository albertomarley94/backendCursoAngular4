var express = require("express");
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

var SEED = require("../congif/config").SEED;
//Inicialización
var app = express();
var Usuario = require("../models/usuario")

app.post("/",(req,res)=>{
    var body = req.body;

    Usuario.findOne({email : body.email}, (err,userFind)=>{
        if(err || !body.password){
            return res.status(400).json({
                ok: false,
                message: "Error en la petición"
            })
        }

        if(!userFind){
            return res.status(400).json({
                ok: false,
                message: "Usuario no existente"
            });
        }

        if(!bcrypt.compareSync(body.password,userFind.password)){
            return res.status(400).json({
                ok: false,
                message: "Usuario no existente : PWD no coincide"
            });
        }
        userFind.password=":=)";
        let token = jwt.sign({usuario : userFind} , SEED , { expiresIn: 14400});
        return res.status(200).json({
            ok: true,
            token: token,
            usuario: userFind
        })
    })
    
})

module.exports = app;