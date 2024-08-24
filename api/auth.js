const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
      const saltRounds = 10; // Adjust salt rounds as needed
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;   
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
});
    

module.exports = router;