const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movies');

mongoose.connect('mongodb://localhost:27017/moviedb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();

//setting pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views');

//Middleware to parse request body
app.use(express.urlencoded({ extended: true }));
//This will serve static files from the 'public' directory
app.use(express.static('public'));

//Use movie routes
app.use('/movies', movieRoutes);
//Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));