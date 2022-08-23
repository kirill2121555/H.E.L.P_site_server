const { Schema, model } = require('mongoose');

const DialogSchema = new Schema({

  room_uuid: { type: String, default: 0 },
  messages: [
    {
      username: { type: String },
      message: { type: String },
    }
  ],

})

module.exports = model('Dialog', DialogSchema);