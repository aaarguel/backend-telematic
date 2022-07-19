const { response, request } = require('express');

const Sensor = require('../models/Sensor');

const createSensor = async( req, res = response )=> {

    const { name, magnitude } = req.body;
    
    try {
        let sensor = await Sensor.findOne({ name });                

        if( sensor ) {
            return res.status(400).json({
                ok: false,
                msg: 'A sensor already exists with that name'
            });
        }
        
        const nsensor = new Sensor( { name,magnitude} );        
        nsensor.save();

        res.status(201).json( nsensor);


    }catch ( error ) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Please inform your administrator'
        });

    }
}


const getSensors = async ( req, res = response ) => {
    try {        
        const [ total, sensors ] = await Promise.all( [
            Sensor.countDocuments(),
            Sensor.find()
        ]);

        res.status(201).json({
            total,
            sensors
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please inform your administrator'
        });        
    }
}

module.exports = {
    getSensors,
    createSensor
}