var jwt = require("jsonwebtoken");
var SEED = require("../congif/config").SEED;

exports.isAutenticado = (req,res,next) => {
    let token = req.headers.token;
    
    jwt.verify(token,SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                error: "No estas logeado",
            })
        }
        req.usuarioToken = decoded;
        next();
    })

};