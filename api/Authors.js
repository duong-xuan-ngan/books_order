const Author = require("../models/Author");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newAuthor = new Author(req.body);
  try {
    const savedAuthor = await newAuthor.save();
    res.status(200).json(savedAuthor);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create author",
      error: err.message
    });
  }
});

// GET Author
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch author",
      error: err.message
    });
  }
});

//GET ALL Authors
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch authors",
      error: err.message
    });
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updatedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(updatedAuthor);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update author",
      error: err.message
    });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json({ message: "Author has been deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete author",
      error: err.message
    });
  }
});

module.exports = router;