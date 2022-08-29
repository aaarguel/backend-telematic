const { Router } = require('express');
const { check } = require('express-validator');
const { createCamera, getCameras, createMeasure, getMeasures } = require('../controllers/CameraController');
const { validateFields } = require('../middlewares/field-validator');
const { validateLocalhost } = require('../middlewares/localhost-validator');

const router = Router();

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('type', 'Es obligatorio el tipo de camara').notEmpty(),    
    validateFields
], createCamera);

router.get('/', getCameras);

router.post('/measures', [
    check('persons', 'El valor es obligatorio').notEmpty(),
    check('img_base64', 'El valor es obligatorio').notEmpty(),
    check('name_camera', 'Es obligatorio enviar el nombre del sensor').notEmpty(),
    validateLocalhost,  
    validateFields
], createMeasure);

router.get('/measures', getMeasures);



module.exports = router;