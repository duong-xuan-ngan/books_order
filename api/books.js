const Books = require("../models/Books");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newBooks = new Books(req.body);

  try {
    const savedBooks = await newBooks.save();
    res.status(200).json(savedBooks);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedBooks = await Books.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedBooks);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Books.findByIdAndDelete(req.params.id);
    res.status(200).json("Books has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Books
router.get("/details/:id", async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.render('BookDetails', { book });;
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch book",
      error: err.message
    });
  }
});

//GET ALL BOOKS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qGenre = req.query.genre; // Changed from category to genre

  try {
    let books;

    if (qNew) {
      books = await Books.find().sort({ createdAt: -1 }).limit(1);
    } else if (qGenre) {
      books = await Books.find({
        genre: qGenre // Changed to match exactly, not using $in
      });
    } else {
      books = await Books.find();
    }

    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

router.get("/descending", async (req, res) => {
      
});



module.exports = router;