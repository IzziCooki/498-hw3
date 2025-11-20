const express = require('express');
const router = express.Router();
const db = require('../database');
const path = require('path');
const pdfFolder = path.join(__dirname, '..', 'pdfs');


router.get("/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(pdfFolder, filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            return res.status(404).send("PDF not found.");
        }
    });
});


module.exports = router;