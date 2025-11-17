const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (!req.session.userId) {
        // If not logged in, redirect to login
        return res.redirect('/login');
    }
    next(); // Continue if logged in
}


// Show Add Movie form (restricted)
router.get('/add', isLoggedIn, (req, res) => {
    res.render('add_movie');
});

// Handle form submission (restricted)
router.post('/add', isLoggedIn, async (req, res) => {
    const { name, description, year, genres, rating } = req.body;
    let errors = [];

    if (!name || !year || !rating) errors.push("Name, year, and rating are required");
    if (rating < 0 || rating > 10) errors.push("Rating must be between 0 and 10");

    if (errors.length > 0) {
        return res.render('add_movie', { errors, name, description, year, genres, rating });
    }

    try {
        const movie = new Movie({
            name,
            description,
            year,
            genres: genres.split(',').map(g => g.trim()),
            rating,
            createdBy: req.session.userId // link movie to logged-in user
        });
        await movie.save();
        res.redirect('/movies/' + movie._id);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
