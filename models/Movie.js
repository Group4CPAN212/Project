const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    year: Number,
    genres: [String],
    rating: {type: Number, min: 0, max: 10},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Movie', movieSchema);