const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true 
    },
    eventDate: { 
      type: Date, 
      required: true 
    },
    startTime: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: props => `${props.value} is not a valid HH:mm format!`
      }
    },
    endTime: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: props => `${props.value} is not a valid HH:mm format!`
      }
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  });  

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
