const express = require("express");
const verifytoken = require("../middlewares/verifyToken");

const router = express.Router();

// Protected route
router.get("/protected", verifytoken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;