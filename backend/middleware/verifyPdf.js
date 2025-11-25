const fs = require('fs');
const path = require('path');   
const pdfFolder = path.join(__dirname, '..', 'pdfs');
const { db } = require('../database');


// Middleware to verify PDF before adding to database
function verifyPdf(req, res, next) {
    const filePath = req.file.path;
    const filename = req.file.filename;
    if (!filename || !filePath) {
        return res.status(400).send('Filename and file path are required');
    }
    next();
}



module.exports = { verifyPdf };