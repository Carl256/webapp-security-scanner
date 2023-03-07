const mongoose = require('mongoose');

const incidentResponseSchema = new mongoose.Schema({
  incidentType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const IncidentResponse = mongoose.model('IncidentResponse', incidentResponseSchema);

module.exports = IncidentResponse;
