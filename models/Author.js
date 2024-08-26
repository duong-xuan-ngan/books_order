const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Book Schema and Model
const authorSchema = new mongoose.Schema({
    name: {type: String, required: true}
});

const author = mongoose.model('author', authorSchema);


module.exports = author;