const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('../db/config')

class Server {

    constructor() {
        this.app  = express();
        
        this.port = process.env.PORT;
        
        this.paths = {
            sensor:    '/sensors', 
            measures:    '/measures',
        };


        //Context DB
        this.connDB();                
        // Middlewares        
        this.middlewares();
        // routes of my app
        this.routes();
    }
    
    async connDB() {
        try {
            
            await mongoose.connect( config[process.env.NODE_ENV]);
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    middlewares() {
        //logger
        this.app.use(logger('dev'));

        // CORS
        this.app.use( cors() );

        // Body JSON
        
        this.app.use( express.urlencoded({extended : true}) );
        this.app.use( express.json() );
        
        // Public Directory
        this.app.use( express.static('public') );
    
    }
    
    routes() {     
        this.app.use( this.paths.sensor, require('../routes/SensorRoute'));    
        this.app.use( this.paths.measures, require('../routes/MeasureRoute'));  
    }

    listen() {        
        this.app.listen( this.port, () => {
            console.log('✔ Express server listening on port %d in %s mode', this.port, this.app.get("env") );
        });
    }
}

module.exports = Server;