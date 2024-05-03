const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
    notebook: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Notebook' 
    },
    title: String,
    text: String,
    created: { 
        type: Date, 
        default: Date.now 
    }
  });
  
  const Note = mongoose.model('Note', noteSchema);
  module.exports = Note;
  