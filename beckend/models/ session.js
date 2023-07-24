const { Schema, model } = require('mongoose')

const sessionSchema = new Schema({
    sessionID: String,
    userID: String,
    username: String,
    connected: Boolean,
    // messages: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
});

module.exports = model('Session', sessionSchema);