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
    res.render('add_movie', { text: "hello" }); // test passing info
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

// Movie list
router.get('/', async (req, res) => {
  const movies = await Movie.find();
  res.render('movie_list', { movies });
});

// Movie details
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.render('movie_details', { movie });
});

// Edit form
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie.createdBy.toString() !== req.session.userId) return res.redirect('/movies/' + movie._id);
  res.render('edit_movie', { movie });
});

// Edit submit
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { name, description, year, genres, rating } = req.body;
  let errors = [];

  if (!name || !year || !rating) errors.push("Name, year, and rating are required");
  if (rating < 0 || rating > 10) errors.push("Rating must be between 0 and 10");

  const movie = await Movie.findById(req.params.id);

  if (movie.createdBy.toString() !== req.session.userId)
    return res.redirect('/movies/' + movie._id);

  if (errors.length > 0)
    return res.render('edit_movie', { errors, movie });

  movie.name = name;
  movie.description = description;
  movie.year = year;
  movie.genres = genres.split(',').map(g => g.trim());
  movie.rating = rating;

  await movie.save();
  res.redirect('/movies/' + movie._id);
});

// Delete movie
router.post('/delete/:id', isLoggedIn, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie.createdBy.toString() !== req.session.userId) return res.redirect('/movies/' + movie._id);
  await Movie.deleteOne({ _id: movie._id });
  res.redirect('/movies');
});

module.exports = router;
