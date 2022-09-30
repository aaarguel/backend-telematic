const { Schema, model } = require('mongoose');

const CameraSchema = Schema({    
    name: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    }    
},{
    timestamps: true,
    toJSON: {virtuals: true}
});

CameraSchema.index({"createdAt":1})
CameraSchema.index({"createdAt":-1})
CameraSchema.index({"updatedAt":1})
CameraSchema.index({"updatedAt":-1})
CameraSchema.methods.toJSON = function() {
    const { __v, _id, ...camera  } = this.toObject();
    camera.uid = _id;
    return camera;
}

module.exports = model(
    'Camera',
    CameraSchema
);