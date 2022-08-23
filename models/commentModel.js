const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    usernick:{type:String,default:'null'},
    text: { type: String, required: true },
    timeOfCreation: { type: Date },
})

module.exports = model('Comment', CommentSchema);