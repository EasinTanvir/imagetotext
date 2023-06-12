const express = require("express");
const router = express.Router();
const { CreateGpt, createMessage, getMessage } = require("../controllers/gpt");
router.route("/:userId").get(getMessage);
router.route("/create").post(CreateGpt);
router.route("/message").post(createMessage);
module.exports = router;
