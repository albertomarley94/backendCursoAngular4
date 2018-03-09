var express = require("express");
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

var SEED = require("../congif/config").SEED;
//Inicialización
var app = express();
var Usuario = require("../models/usuario")
/* ***********************************
 AUTENTICACION GOOGLE
*******/
const {OAuth2Client} = require('google-auth-library');
const GOOGLE_CLIENT_ID= "447708256774-rrjnlh7vf3ag53m9k7t5hcl9vhcjg75i.apps.googleusercontent.com";
const GOOGLE_SECRET= "Sz0Y7KexoauYb-tYFHEylAd4";

app.post("/google",(req,res)=>{
    var token = req.body.token;
    
    if(token){
        const oAuth2Client = new OAuth2Client(
            GOOGLE_CLIENT_ID,
            GOOGLE_SECRET
        );
        oAuth2Client.verifyIdToken({idToken: token}).then((data)=>{
            return res.status(200).json({
                datos: data.payload
            })
        }).catch(err=>{
            return res.status(500).json({
                error: "Token no valido"
            })
        });

    }else{
        return res.status(500).json({
            error: "Fallo en la autentificación"
        })
    }
    
});
/* ***********************************
 AUTENTICACION NORMAL
*******/
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