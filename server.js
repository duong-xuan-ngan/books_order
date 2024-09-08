require('./config/db');

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory where your EJS files are located
app.set('views', path.join(__dirname, 'views'));

// Route for serving static files (e.g., CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));
const UserRouter = require('./api/User');
app.use('/user', UserRouter);

// Modify these routes
app.get('/user', async (req, res) => {
    try {
        const books = await Book.find();
        res.render("BookStore", { books, currentSort: 'default' });
    } catch (err) {
        console.error("Error fetching books:", err);
        res.render("BookStore", { books: [], error: "Failed to fetch books. Please try again later." });
    }
});

app.get('/user/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.render('BookDetails', { book });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Routes for rendering EJS templates
app.get('/signin', (req, res) => {
    res.render('signin');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});