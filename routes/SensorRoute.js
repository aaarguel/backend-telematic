const { Router } = require('express');
const { check } = require('express-validator');
const { getSensors, createSensor, createMeasure, getMeasures } = require('../controllers/SensorController');
const { validateFields } = require('../middlewares/field-validator');

const router = Router();

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('magnitude', 'Es obligatoria la magnitud del sensor').notEmpty(),    
    validateFields
], createSensor);

router.get('/', getSensors);

router.post('/measures', [
    check('value', 'El valor es obligatorio').notEmpty(),
    check('name_sensor', 'Es obligatorio enviar el nombre del sensor').notEmpty(),    
    validateFields
], createMeasure);

router.get('/measures', getMeasures);

module.exports = router;