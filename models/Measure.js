const { Schema, model } = require('mongoose');

const MeasureSchema = Schema({
    
    value: {
        type: Number,
        require: true
    },

    sensor: {
        type: Schema.Types.ObjectId,
        ref: 'Sensor',
        require: true
    }
    
},{
    timestamps: true,
    toJSON: {virtuals: true}
});

MeasureSchema.methods.toJSON = function() {
    const { __v, _id, ...measure  } = this.toObject();
    measure.uid = _id;
    return measure;
}

module.exports = model(
    'Measure',
    MeasureSchema
);