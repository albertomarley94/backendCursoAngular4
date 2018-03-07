var express = require("express");
var bcrypt = require('bcryptjs');

//Middlewares
var comprobarLogin = require('../middlewares/autenticacion').isAutenticado;
//Inicialización
var Usuario = require("../models/usuario");
var app = express();

//Rutas*********************************************************

//Obtener todos los Usuario
app.get("/",(req,response)=>{
    let desde = req.query.page || 0; 
    desde = Number(desde);
    Usuario.find({},'nombre email img role')
        .skip(desde)
        .limit(10)
        .exec((error,resp)=>{
            if(error){
                return response.status(500).json({
                    ok: false,
                    mensaje: error
                })
            }
            else{
                Usuario.count({},(err,cont)=>{
                    if(!cont){

                    }
                    return response.status(200).json({
                        ok: true,
                        mensaje: "Peticion usuario",
                        total: cont,
                        usuarios: resp
                    }) 
                });                        
            }
        });

})

//Crear un nuevo usuario
app.post("/", comprobarLogin ,(req,res)=>{
    var body = req.body;
    //Role siempre a mayuscula
    if(body.role){body.role = body.role.toUpperCase();}
    if(body.password){body.password=bcrypt.hashSync(body.password,10)}
    var user = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    user.save((error,userSave)=>{
        if(error){
            return res.status(400).json({
                ok: false,
                error: error
            })
        }
        else{
            return res.status(201).json({
                ok: true,
                mensaje: "Usuario Creado",
                usuario: userSave
            })
        }
    })
});


//Actualizar usuario
app.put("/:id", comprobarLogin ,(req,res)=>{
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err,resp)=>{
        if(err){
            return res.status(500).json({
                message: "Error en el buscador de usuarios",
                okay: true
            })
        }
        if(!resp){
            return res.status(500).json({
                message: "El usuario con el id "+id+" no existe",
                errors: "Error",
                okay: true
            })
        }
        let usuario = resp;

        if(body.nombre)usuario.nombre=body.nombre;
        if(body.email)usuario.email=body.email;
        if(body.img)usuario.img=body.img;

        usuario.save((err,resp)=>{
            if(err){
                return res.status(500).json({
                    message: "Error al actualizar el usuario",
                    okay: true
                })
            }else{
                return res.status(200).json({
                    message: "Usuario Actualizado",
                    usuario: resp,
                    okay: true
                })
            }
        });
    });
    
    });

    app.delete("/:id", [comprobarLogin] ,(req,res)=>{
        let id = req.params.id;

        Usuario.findByIdAndRemove(id,(err,resp)=>{
            if(err){
                return res.status(500).json({
                    message: "Problema al eliminar usuario con id "+id,
                    okay: false
                })
            }
            if(!resp){
                return res.status(400).json({
                    message: "Usuario no encontrado",
                    okay: true
                })
            }
            return res.status(200).json({
                message: "Usuario eliminado",
                usuario: resp,
                okay: true
            })
        });
    });


module.exports = app;