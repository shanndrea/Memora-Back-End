const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  day: Number,
  month: Number,
  year: Number,
  events: [{
    title: String,
    time: String
  }],
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
  });  

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
