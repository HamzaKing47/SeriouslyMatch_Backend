// const mongoose = require('mongoose');

// const movieRequestSchema = new mongoose.Schema({
//   fromUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   toUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   plan: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'MoviePlan',
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'declined'],
//     default: 'pending'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('MovieRequest', movieRequestSchema);
