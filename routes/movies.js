const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Export router
module.exports = router;

//Handles submission
router.post('/add', async (req, res) => {
    const { name, description, year, genres, rating } = req.body;
    let errors = [];

    // Basic validation
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
            genres: genres.split(',').map(g => g.trim())
        });
        await movie.save();
        res.redirect('/movies/' + movie._id);
    } catch (err) {
        res.send(err);
    }
});

//Displays details of a specific movie
router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.render('movie_details', { movie });
});


// Render edit form
router.get('/edit/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.render('edit_movie', { movie });
});

// Handle form submission
router.post('/edit/:id', async (req, res) => {
    const { name, description, year, genres, rating } = req.body;
    await Movie.findByIdAndUpdate(req.params.id, {
        name, description, year, genres: genres.split(',').map(g => g.trim()), rating
    });
    res.redirect('/movies/' + req.params.id);
});

// Handle deletion
router.post('/delete/:id', async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

