const { Router } = require('express');
const { check } = require('express-validator');
const { getMeasures, createMeasure } = require('../controllers/MeasureController');

const { validateFields } = require('../middlewares/field-validator');

const router = Router();

router.post('/', [
    check('value', 'El valor es obligatorio').notEmpty(),
    check('name_sensor', 'Es obligatorio enviar el nombre del sensor').notEmpty(),    
    validateFields
], createMeasure);

router.get('/', getMeasures);

module.exports = router;