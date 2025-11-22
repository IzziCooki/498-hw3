const express = require('express');
const router = express.Router();
const { getPdfs, checkPdfExists } = require('../middleware/verifyPdf');

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