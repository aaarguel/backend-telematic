const { response } = require('express');

const validateLocalhost = ( req, res= response, next ) => {   
    console.log(req._remoteAddress);
    if( req._remoteAddress != "::1" ){
     return res.status(400).json({
         ok: false,
         msg: "You don't have permissions to consume this route"
     });
    }

    next();
}

module.exports = {
    validateLocalhost,
}