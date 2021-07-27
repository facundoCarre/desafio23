const mongoose = require('mongoose');

const schema = mongoose.Schema({
    author: { type: mongoose.SchemaTypes.Mixed, required: true},
    text: { type: String, require: true, max: 100 },
});

const Message = mongoose.model('mensajes', schema);

module.exports = Message;