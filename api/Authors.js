const Author = require("../models/author");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newAuthor = new Author(req.body);
  try {
    const savedAuthor = await newAuthor.save();
    res.status(200).json(savedAuthor);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL AUTHORS
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Other CRUD operations...

module.exports = router;