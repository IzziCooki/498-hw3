const fs = require('fs');
const path = require('path');   
const pdfFolder = path.join(__dirname, '..', 'pdfs');
const { db } = require('../database');

function verifyPdf(req, res, next) {
    const filePath = req.file.path;
    const filename = req.file.filename;
    if (!filename || !filePath) {
        return res.status(400).send('Filename and file path are required');
    }
    next();
}

/*
 validate that a requested PDF exists and is within the designated folder
 Prevents path traversal attacks and ensures only PDFs in the pdfs folder are accessible
 */
function checkPdfExists(req, res, next) {
    const filename = req.params.filename;
    
    // Validate filename is provided
    if (!filename) {
        return res.status(404).render('404Page', {
            layout: 'layout/main',
            title: '404 - PDF Not Found',
            siteTitle: '404 - PDF Not Found',
            errorMessage: 'Filename is required'
        });
    }

    // Ensure filename ends with .pdf extension
    if (!filename.toLowerCase().endsWith('.pdf')) {
        return res.status(404).render('404Page', {
            layout: 'layout/main',
            title: '404 - Invalid File Type',
            siteTitle: '404 - Invalid File Type',
            errorMessage: 'Invalid file type: only PDF files are allowed'
        });
    }
    
    // Construct the full file path
    const filePath = path.join(pdfFolder, filename);
    
    // Resolve to absolute path to prevent path traversal
    const resolvedPath = path.resolve(filePath);
    const resolvedPdfFolder = path.resolve(pdfFolder);
    
    // Ensure the resolved path is within the pdfs folder
    if (!resolvedPath.startsWith(resolvedPdfFolder)) {
        return res.status(404).render('404Page', {
            layout: 'layout/main',
            title: '404 - Access Denied',
            siteTitle: '404 - Access Denied',
            errorMessage: 'Access denied: file outside designated folder'
        });
    }
    
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
        return res.status(404).render('404Page', {
            layout: 'layout/main',
            title: '404 - PDF Not Found',
            siteTitle: '404 - PDF Not Found',
            errorMessage: `PDF "${filename}" not found`
        });
    }
    
    // Check if it's actually a file (not a directory)
    try {
        const stats = fs.statSync(resolvedPath);
        if (!stats.isFile()) {
            return res.status(404).render('404Page', {
                layout: 'layout/main',
                title: '404 - Invalid File',
                siteTitle: '404 - Invalid File',
                errorMessage: 'Invalid file: not a regular file'
            });
        }
    } catch (err) {
        return res.status(404).render('404Page', {
            layout: 'layout/main',
            title: '404 - Error',
            siteTitle: '404 - Error',
            errorMessage: 'Error accessing file'
        });
    }
    
    // Attach validated file path to request object for use in route handler
    req.validatedPdfPath = resolvedPath;
    next();
}

function getPdfs(req, res, next) {
    db.all('SELECT * FROM pdfs', (err, rows) => {
        if (err) {
            console.error('Error fetching PDFs:', err);
            return res.status(500).send('Error fetching PDFs');
        }
        req.pdfs = rows;
        next();
    });
}

module.exports = { verifyPdf, getPdfs, checkPdfExists };