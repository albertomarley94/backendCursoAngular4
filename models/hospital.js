var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

var hospitalSchema =new Schema({
    nombre: {	
        type: String,	
        required: [true,'El	nombre	es	necesario'],
        unique: true	
    },
	img: {	
        type: String,	
        required: false 
    },
	usuario: {	
        type: Schema.Types.ObjectId,	
        ref: 'usuario' 
    }
}, {collection: 'hospitales'});

hospitalSchema.plugin(uniqueValidator,{message : "{PATH} esta repetido"});
module.exports = mongoose.model('hospital',	hospitalSchema);