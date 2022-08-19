const { response, request } = require('express');


const Camera = require('../models/Camera');
const Measures = require('../models/MeasureCamera');

const createCamera = async( req, res = response )=> {

    const { name, type } = req.body;
    
    try {
        let camera = await Camera.findOne({ name });                

        if( camera ) {
            return res.status(400).json({
                ok: false,
                msg: 'A camera already exists with that name'
            });
        }
        
        const ncamera = new Camera( { name,type} );        
        ncamera.save();

        res.status(201).json( ncamera);


    }catch ( error ) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Please inform your administrator'
        });

    }
}


const getCameras = async ( req, res = response ) => {
    try {        
        const [ total, cameras ] = await Promise.all( [
            Camera.countDocuments(),            
            Camera.find()
        ]);

        
        const cameraswithLastData = cameras.map(cam=>{            
            return Measures.findOne({camera:cam._id},{createdAt: 0, updatedAt: 0,  _id : 1, img_base64:0}).sort({ createdAt: -1 }).then(lastMeasure=>{
                cam = cam.toJSON();
                cam.lastMeasure = lastMeasure?.persons ? lastMeasure.persons : 0;
                return cam;
            }) 
        });

        const query  = await Promise.all(cameraswithLastData);

        res.status(201).json({
            total,
            data: query
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please inform your administrator'
        });        
    }
}


const createMeasure = async( req, res = response )=> {

    const { persons,img_base64,name_camera } = req.body;
    
    try {
    
        let camera = await Camera.findOne({ name:name_camera });                
    
        if( camera ) {
            
            const measure = new Measures( { persons,img_base64,camera: camera._id} );        
            measure.save();

            req.io.emit("camerameasure:read",measure.toJSON());
            res.status(201).json( measure);
        }
        else{
            return res.status(400).json({
                ok: false,
                msg: 'This camera does not exist'
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
            Measures.countDocuments(),
            Measures.find({},{createdAt: 1, updatedAt: 1,  _id : 1, img_base64:0})
        ]);

        res.status(200).json({
            total,
            data: measures
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
    getCameras,
    createCamera,
    getMeasures,
    createMeasure,
}