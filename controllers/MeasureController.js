const { response, request } = require('express');
const Measure = require('../models/Measure');
const Sensor = require('../models/Sensor');



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

module.exports = {
    createMeasure,
    getMeasures
}