//Api route to view and serve PDFs


const express = require('express');
const router = express.Router();
const { checkPdfExists } = require('../middleware/checkPdfExists.js');
const { getPdfs } = require('../middleware/getPdfs.js');

// Download route
router.get("/download/:filename", checkPdfExists, (req, res) => {
    res.download(req.validatedPdfPath, req.params.filename, (err) => {
        if (err) {
            console.error('Error downloading PDF file:', err);
            if (!res.headersSent) {
                res.status(500).send("Error downloading file");
            }
        }
    });
});

// Use checkPdfExists middleware to validate PDF before serving
router.get("/:filename", checkPdfExists, (req, res) => {
    // Use the validated path from the middleware
    res.sendFile(req.validatedPdfPath, (err) => {
        if (err) {
            console.error('Error sending PDF file:', err);
            return res.status(404).render('404Page', {
                layout: 'layout/main',
                title: '404 - Error Serving PDF',
                siteTitle: '404 - Error Serving PDF',
                errorMessage: 'Error serving PDF file'
            });
        }
    });
});


router.get('/', getPdfs, (req, res) => {
    res.render('viewPdfs', {
        layout: 'layout/main',
        title: 'View PDFs',
        siteTitle: 'View PDFs',
        pdfs: req.pdfs || []
    });
});


module.exports = router;