const mongoose = require('mongoose');

// Create a Log schema
const logSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  message: String,
  level: String,
  source: String,
  // any additional fields you need for your logs
});

// Create a Log model
const Log = mongoose.model('Log', logSchema);

// Export the Log model
module.exports = {
  Log
};