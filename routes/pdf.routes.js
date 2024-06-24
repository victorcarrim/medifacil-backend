const express = require("express")
const router = express.Router();
const { generatePdf } = require("../controller/pdf.controller")

router.get("/generate-pdf/:id", 
generatePdf);

module.exports = router;