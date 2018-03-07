var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var rolesValidos = {
    values: [
        'ADMIN_ROLE',
        'USER_ROLE'
    ],
    message: "{VALUE} no es un rol valido"
}
var usuarioSchema = new mongoose.Schema({
    "nombre":{
        type: "string",
        required: [true, "Nombre es necesario"]
    },
    "email":{
        type: "string",
        required: [true, "Email es necesario"],
        unique: true
    },
    "password":{
        type: "string",
        required: [true, "Password es necesario"]
    },
    "img":{
        type: "string",
        required: [false]
    },
    "role":{
        type: "string",
        required: [true],
        default: "USER_ROLE",
        enum: rolesValidos
    } 
},{collection: "usuarios"});

usuarioSchema.plugin(uniqueValidator, {message : "{PATH} debe ser unico"});

module.exports = mongoose.model("usuario", usuarioSchema);