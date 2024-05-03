const mongoose = require('mongoose');
const notebookSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  name: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: 'Note' 
}]
});

const Notebook = mongoose.model('Notebook', notebookSchema);
module.exports = Notebook;
