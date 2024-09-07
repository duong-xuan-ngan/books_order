const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Book Schema and Model
const BookSchema = new mongoose.Schema({
  barcode: {type: Number},
  title: { type: String, required: true, unique: true },
  publisher: String,
  genre: { type: Array },
  pages: Number,
  original_price: {type: Number},
  price: { type: Number, required: true },
  quantityInStock: { type: Number, required: true },
  image_of_author: {type: String},
  author_description: { type: String },
  author: {type: String, required: true},
  description: {type: String, required: true},
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