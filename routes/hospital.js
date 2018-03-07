var express = require("express");
//Middleware
var comprobarLogin = require('../middlewares/autenticacion').isAutenticado;
//Model
var Hospital = require("../models/hospital");

var app = express();

    /***************************************************************
     * //GET HOSPITALES
     **************************************************************/

    app.get("/",(req,res)=>{
        let desde = Number(req.query.desde) || 0;
        Hospital
            .find({})
            .skip(desde)
            .limit(5)
            .populate('usuario' , 'nombre email')
            .exec((err,hospitales)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        message: "Error en la solicitud",
                        err:err
                    })
                }
                Hospital.count({},(err,cont)=>{
                    return res.status(200).json({
                        ok: true,
                        count: cont,
                        hospitales: hospitales
                    })
                })
            });
    });

    /***************************************************************
     * //AÑADIR HOSPITALES
     **************************************************************/

    app.post("/", comprobarLogin ,(req,res)=>{
        let body = req.body;

        let hospital = new Hospital({
            nombre: body.nombre,
            img: body.img || "",
            usuario: req.usuarioToken.usuario._id
        });

        hospital.save((err,hospitalSaved)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: "Error en la peticion",
                    error: err
                })
            }

            return res.status(201).json({
                ok: true,
                hospital: hospitalSaved
            })
        })
    })

    /***************************************************************
     * //ACTUALIZAR HOSPITALES
     **************************************************************/

    app.put("/:id", comprobarLogin, (req,res) => {
        let id = req.params.id;
        let body = req.body;

        Hospital.findById(id,(err,hospital) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: "Error en la peticion",
                    error: err
                })
            }
            if(!hospital){
                return res.status(400).json({
                    ok: false,
                    message: "Hospital no encontrado"
                }) 
            }

            hospital.nombre = body.nombre || hospital.nombre;
            hospital.img = body.img || hospital.img;
            hospital.usuario = req.usuarioToken.id || hospital.usuario;

                hospital.save((err,newHospital)=>{
                    if(err){
                        return res.status(500).json({
                            message: "Error en la petición",
                            okay: true,
                            err
                        })
                    }else{
                        return res.status(200).json({
                            message: "Hospital Actualizado",
                            hospital: newHospital,
                            okay: true
                        })
                    }
                });
        })
    });

    /***************************************************************
    * //ELIMINAR HOSPITALES
    **************************************************************/
   
    app.delete("/:id", comprobarLogin, (req,res) => {
        var id = req.params.id;
        
        Hospital.findByIdAndRemove(id,(err,hospitalEliminado)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: "Error en la petición"
                });
            }
            if(!hospitalEliminado){
                return res.status(400).json({
                    ok: false,
                    message: "Usuario no encontrado"
                });
            }
            return res.status(200).json({
                ok: true,
                message: hospitalEliminado
            });
        });
    });




module.exports = app;