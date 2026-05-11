const express = require("express");
const router = express.Router();

const { getShows } = require("../controllers/showController");

router.get("/:movieId", getShows);

module.exports = router;