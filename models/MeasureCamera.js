const { Schema, model } = require('mongoose');

const MeasureCameraSchema = Schema({
    
    persons: {
        type: Number,
        require: true
    },
    img_base64: {
        type: String,
        require: true
    },
    camera: {
        type: Schema.Types.ObjectId,
        ref: 'Camera',
        require: true
    }
    
},{
    timestamps: true,
    toJSON: {virtuals: true}
});

MeasureCameraSchema.index({"createdAt":1})
MeasureCameraSchema.index({"createdAt":-1})
MeasureCameraSchema.index({"updatedAt":1})
MeasureCameraSchema.index({"updatedAt":-1})

MeasureCameraSchema.methods.toJSON = function() {
    const { __v, _id, ...measure  } = this.toObject();
    measure.uid = _id;
    return measure;
}

module.exports = model(
    'MeasureCamera',
    MeasureCameraSchema
);