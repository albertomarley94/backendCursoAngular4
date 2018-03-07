const express = require("express");
const app = express();
const fileUpload = require('express-fileupload');
//File system de node
const fs = require('fs');

app.use(fileUpload());

var Hospitales = require("../models/hospital");
var Medicos = require("../models/medico");
var Usuarios = require("../models/usuario");

app.put("/:tipo/:id",(req,res)=>{
    var id = req.params.id;

    //TIPOS//////////////////////////////
    var tipo = req.params.tipo;
    var tipos = ["usuarios","medicos","hospitales"];
    if(tipos.indexOf(tipo)<0){
        return res.status(500).json({
            message:"Tipo no valido [usuarios,medicos,hospitales]"
        });   
    }

    //ARCHIVO/////////////////////////////
    if(!req.files){
        return res.status(500).json({
            message:"No hay ningun archivo cargado"
        }); 
    }
    var img = req.files.image;

    //EXTENSION///////////////////////////
    var nombreSplit = img.name.split('.');
    var extension = nombreSplit[nombreSplit.length-1].toLowerCase();
    var extensiones = ['jpg','png','jpeg','gif'];
    if(extensiones.indexOf(extension)<0){
        return res.status(500).json({
            message:"Extension no valida"
        });     
    }

    //SUBIDA IMAGEN///////////////////////////////////////
    var filename = `${id}-${new Date().getMilliseconds()}.${extension}`
    var path = `./uploads/${tipo}/${filename}`;
    img.mv(path,(err,check)=>{
        if(err){
            return res.status(500).json({
                message:"Error en la subida",
                err:err
            });  
        }
        linkarImagen(tipo,id,filename,res);
    })  
});


//LINK IMAGEN CON USUARIO,MEDICO,HOSPITAL
var linkarImagen = (tipo,id,filename,res)=>{
    switch(tipo){
        case "usuarios":
            Usuarios.findById(id,(err,usuario)=>{
                if(!usuario){
                    return res.status(400).json({
                        message: "Usuario no encontrado"
                    })
                }
                let pathViejo = "./uploads/usuarios/"+usuario.img;
                if(fs.existsSync(pathViejo)){
                    fs.unlink(pathViejo);
                }

                usuario.img = filename;
                usuario.save((err,guardado)=>{
                    return res.status(200).json({
                        message: "Imagen actualizada",
                        usuario: guardado
                    })
                })
            })
            break;
        case "medicos":
            Medicos.findById(id,(err,medico)=>{
                if(!medico){
                    return res.status(400).json({
                        message: "Medico no encontrado"
                    })
                }
                let pathViejo = "./uploads/medicos/"+medico.img;
                if(fs.existsSync(pathViejo)){
                    fs.unlink(pathViejo);
                }

                medico.img = filename;
                medico.save((err,guardado)=>{
                    return res.status(200).json({
                        message: "Imagen actualizada",
                        medico: guardado
                    })
                })
            })
            break;
        case "hospitales":
            Hospitales.findById(id,(err,hospital)=>{
                if(!hospital){
                    return res.status(400).json({
                        message: "Hospital no encontrado"
                    })
                }
                let pathViejo = "./uploads/hospitales/"+hospital.img;
                if(fs.existsSync(pathViejo)){
                    fs.unlink(pathViejo);
                }

                hospital.img = filename;
                hospital.save((err,guardado)=>{
                    return res.status(200).json({
                        message: "Imagen actualizada",
                        hospital: guardado
                    })
                })
            })
            break;
        default:
            break;
    }
}


module.exports = app;