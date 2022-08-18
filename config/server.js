const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('../db/config');

class Server {

    constructor() {
        this.app  = express();
        
        this.port = process.env.PORT;
        
        this.server = require('http').createServer( this.app );
        this.io     = require('socket.io')( this.server, {           
            cors: {
              origin: "http://localhost:3000",
              methods: ["GET", "POST"]
            }
        });

        this.paths = {
            sensor:    '/sensors', 
            camera:    '/cameras'
        };


        //Context DB
        this.connDB();                
        // Middlewares        
        this.middlewares();
        // routes of my app
        this.routes();
        //Sockets
        this.sockets();
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
        //SocketIO
        this.app.use((req, res, next) => {
            req.io = this.io;
            next();
        });

        //logger
        this.app.use(logger('dev'));

        // CORS
        this.app.use( cors() );

        // Body JSON
                
        this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.urlencoded({limit: '50mb',extended:true}));
        
        // Public Directory
        this.app.use( express.static('public') );

        
    
    }
    
    routes() {     
        this.app.use( this.paths.sensor, require('../routes/SensorRoute'));  
        this.app.use( this.paths.camera, require('../routes/CameraRoute'));    
    }

    sockets() {
        this.io.on('connection', (socket) => {        
            //Know Clients
            console.log('Cliente conectado', socket.id );
            //Basic functions
            socket.on('disconnect', () => {
                console.log('Cliente desconectado', socket.id );
            });
        
            //routes
            socket.on("sensormeasure:read", require('../sockets/SensorSocket')(this.io).readSensorMeasure);
        
        });
    }

    listen() {        
        this.server.listen( this.port, () => {
            console.log('✔ Express server listening on port %d in %s mode', this.port, this.app.get("env") );
        });
    }
}

module.exports = Server;