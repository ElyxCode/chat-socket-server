
const { Schema, model } = require('mongoose');

const MessageSchema = Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
},{
    timestamps: true // registra fecha de creacion o ultima modificacion
});

MessageSchema.method('toJSON',  function(){
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Message', MessageSchema);