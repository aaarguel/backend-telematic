const { Schema, model } = require('mongoose');

const SensorSchema = Schema({
    
    name: {
        type: String,
        require: true
    },
    magnitude: {
        type: String,
        require: true
    }    
},{
    timestamps: true,
    toJSON: {virtuals: true}
});

SensorSchema.methods.toJSON = function() {
    const { __v, _id, ...sensor  } = this.toObject();
    sensor.uid = _id;
    return sensor;
}

module.exports = model(
    'Sensor',
    SensorSchema
);