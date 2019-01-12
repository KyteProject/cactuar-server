const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChallengeLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  title: {
    type: String,
    required: true,
    max: 50,
  },
  streak: {
    type: Number,
    default: 0,
  },
  date: { type: Date },
});

module.exports = mongoose.model('challenge-log', ChallengeLogSchema);
