const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  category: String,
  user_id: String,
  noteDate: String
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
