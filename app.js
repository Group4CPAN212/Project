const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); // NEW
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users'); // NEW

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/moviedb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();

// Setting Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use(express.static('public'));

// Session setup (for login/logout)
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Make session info available to all Pug templates
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});


// Routes
app.use('/movies', movieRoutes);  // Movie routes
app.use('/', userRoutes);         // User routes (register, login, logout)

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
