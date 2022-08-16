const { response, request } = require('express');

const Sensor = require('../models/Sensor');
const Measure = require('../models/MeasureSensor');

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


const createMeasure = async( req, res = response )=> {

    const { value,name_sensor } = req.body;
    
    try {
    
        let sensor = await Sensor.findOne({ name:name_sensor });                
    
        if( sensor ) {
            
            const measure = new Measure( { value,sensor: sensor._id} );        
            measure.save();
            
            res.status(201).json( measure);
        }
        else{
            return res.status(400).json({
                ok: false,
                msg: 'This sensor does not exist'
            });
        }
        


    }catch ( error ) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Please inform your administrator'
        });

    }
}


const getMeasures = async ( req, res = response ) => {
    try {        
        const [ total, measures ] = await Promise.all( [
            Measure.countDocuments(),
            Measure.find().populate('sensor').exec()
        ]);

        res.status(200).json({
            total,
            measures
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please inform your administrator'
        });        
    }
}

const getLastMeasure = async ( req, res = response ) => {
    try {        
        const [ total, measures ] = await Promise.all( [
            10,
            Measure.find().sort({ createdAt: -1 }).limit(10) 
        ]);

        res.status(200).json({
            total,
            measures
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please inform your administrator'
        });        
    }
}

module.exports = {
    getSensors,
    createSensor,
    getMeasures,
    getLastMeasure,
    createMeasure,
}