const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
    id: Number,
    content: String,
    date: String,
    from: String,
    to: String,
    sent: Boolean,
});

module.exports = model('Chat', chatSchema);
