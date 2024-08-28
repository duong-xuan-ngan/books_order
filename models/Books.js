const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Book Schema and Model
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  publisher: String,
  publicationYear: Number,
  genre: { type: Array },
  pages: Number,
  price: { type: Number, required: true },
  quantityInStock: { type: Number, required: true },
  description: { type: String, required: true, },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  image: {
    type: String,
    default: ''
  },
  images: [{
      type: String
  }]
  });

const Book = mongoose.model('Book', BookSchema);


module.exports = Book;