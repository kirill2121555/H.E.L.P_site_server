const { Schema, model } = require('mongoose');

const BlogSchema = new Schema({
  title: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  datacreate: { type: Date, default: Date.now(), index: true },
  comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  picture: [{ type: String }],

})

module.exports = model('Blog', BlogSchema);