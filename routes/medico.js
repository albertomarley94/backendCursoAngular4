var express = require("express");
var app = express();
let generarToken = require("../middlewares/autenticacion").isAutenticado;
var Medico = require('../models/medico');


    /***************************************************************
    * //GET MEDICOS
    **************************************************************/

    app.get("/",(req,res)=>{
        let desde = Number(req.query.desde) || 0;
        Medico.find({})
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err,medicos)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: "Error en la peticion",
                    error: err
                })
            }
            Medico.count({},(err,cont)=>{
                return res.status(200).json({
                    ok: true,
                    cont: cont || 0,
                    medicos: medicos
                })
            })
        });
    });

    /***************************************************************
    * //AÑADIR MEDICO
    **************************************************************/

   app.post("/", generarToken,(req,res)=>{
        let body = req.body;

        let medico = new Medico({
            nombre: body.nombre,
            img: body.img,
            usuario: req.usuarioToken.usuario._id,
            hospital: body.hospital

        });

     
        medico.save((err,medico) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: "Error en la peticion"
                })
            }
            return res.status(201).json({
                    ok: true,
                    medicos: medico
            })
        });
    });

    /***************************************************************
    * //ACTUALIZAR MEDICO
    **************************************************************/

    app.put("/:id", generarToken ,(req,res) => {
        let body = req.body;
        let id = req.params.id;
        Medico.findById(id,(err,medicoBusq)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error en la peticion"
                })
            }
            if(!medicoBusq) {
                return res.status(401).json({
                    ok: false,
                    message: "Usuario no encontrado"
                })
            }

            if(body.nombre) medicoBusq.nombre = body.nombre;
            if(body.img) medicoBusq.img = body.img;
            medicoBusq.usuario = req.usuarioToken.usuario._id;
            if(body.hospital) medicoBusq.hospital = body.hospital;


            medicoBusq.save((err,medicoAct)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "Error en la peticion"
                    })
                }
                return res.status(200).json({
                    message: medicoAct,
                    ok:true
                })
            })
            
        })
    });

    /***************************************************************
    * //Eliminar MEDICO
    **************************************************************/

    app.delete("/:id", generarToken, (req,res) => {
        let id = req.params.id;

        Medico.findByIdAndRemove(id,(err,medicoElim) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    message: "Error en la petición"
                })
            }
            if(!medicoElim){
                return res.status(401).json({
                    ok:false,
                    message: "Usuario no encontrado"
                })
            }
            return res.status(200).json({
                ok: true,
                message: "Eliminado",
                medico: medicoElim
            })
        })
    })

module.exports = app;