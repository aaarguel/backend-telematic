const { Router } = require('express');
const { check } = require('express-validator');
const { getSensors, createSensor } = require('../controllers/SensorController');
const { validateFields } = require('../middlewares/field-validator');

const router = Router();

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('magnitude', 'Es obligatoria la magnitud del sensor').notEmpty(),    
    validateFields
], createSensor);

router.get('/', getSensors);

module.exports = router;