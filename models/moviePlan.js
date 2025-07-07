const mongoose = require('mongoose');

const moviePlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cinema: {
    type: String,
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  showtime: {
    type: Date,
    required: true
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MoviePlan', moviePlanSchema);
