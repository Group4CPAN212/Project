const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Show registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Show login page
router.get('/login', (req, res) => {
    res.render('login');
});


// Registration route (POST)
router.post('/register', async (req, res) => {
    const { username, password, password2 } = req.body;
    let errors = [];

    if (!username || !password || !password2) errors.push("All fields required");
    if (password !== password2) errors.push("Passwords do not match");

    if (errors.length > 0) return res.render('register', { errors });

    try {
        const user = new User({ username, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.send("Error registering user: " + err.message);
    }
});

// Login route (POST)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { error: "Invalid username or password" });
    }

    req.session.userId = user._id;
    res.redirect('/');
});

// Logout route (GET)
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
