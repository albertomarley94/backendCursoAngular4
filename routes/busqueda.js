var express = require("express");
var app = express();

var Hospitales = require("../models/hospital");
var Medicos = require("../models/medico");
var Usuarios = require("../models/usuario");


app.get("/:tabla/:busqueda",(req,res)=>{
    busqueda = req.params.busqueda;
    tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    //BUSCADOR 
    switch(tabla){
        case "todo":
            Promise.all([
                getHospitales(regex),
                getMedicos(regex),
                getUsuarios(regex)
            ]).then((data)=>{
                return res.status(200).json({
                    hospitales: data[0],
                    medicos: data[1],
                    usuarios: data[2]
                })
            },(err)=>{
                return res.status(500).json({
                    message: err
                })
            });
            break;
        case "usuarios":
            getUsuarios(regex).then((data)=>{
                return res.status(200).json({
                    usuarios: data
                })
            },(err)=>{
                return res.status(500).json({
                    message: err
                })
            });
            break;
        case "medicos":
            getMedicos(regex).then((data)=>{
                return res.status(200).json({
                    medicos: data
                })
            },(err)=>{
                return res.status(500).json({
                    message: err
                })
            });
            break;
        case "hospitales":
            getHospitales(regex).then((data)=>{
                return res.status(200).json({
                    hospitales: data
                })
            },(err)=>{
                return res.status(500).json({
                    message: err
                })
            }); 
            break;
        default:
            return res.status(404).json({
                message: "Tabla no aceptada, los valores admitidos son todo,usuarios,medicos o hospitales"
            })
            break;
    }
});

var getHospitales = function(regex){
    return new Promise((resolve,reject)=>{
        Hospitales
            .find({ nombre : regex })
            .populate('usuario', 'nombre email')
            .exec((err,hospitales)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(hospitales);
                }
            })
    });
}

var getMedicos = function(regex){
    return new Promise((resolve,reject)=>{
        Medicos.find({ nombre : regex })
                .populate('usuario', 'nombre email')
                .exec((err,hospitales)=>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(hospitales);
                    }
                })
    });
}

var getUsuarios = function(regex){
    return new Promise((resolve,reject)=>{
        Usuarios.find({},'nombre email role')
        .or([{'nombre': regex} , {'email':regex}])
        .exec((err,hospitales)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(hospitales);
            }
        })
    });
}
module.exports = app;