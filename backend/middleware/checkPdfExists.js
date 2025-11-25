const fs = require('fs');
const path = require('path');
const pdfFolder = path.join(__dirname, '..', 'pdfs');

/**
 validate PDF exists in designated folder
 Prevents path traversal attacks using'..'
 */
function checkPdfExists(req, res, next) {
    const filename = req.params.filename;
    
    // If filename exists, continue
    if (!filename) {
        return res.status(404).render('404Page', {
            layout: 'layout/main',
            title: '404 - PDF Not Found',
            siteTitle: '404 - PDF Not Found',
            errorMessage: 'Filename is required'
        });
    }

    // Ensure filename ends with .pdf 
    if (!filename.toLowerCase().endsWith('.pdf')) {
        return res.status(404).render('404Page', {
            layout: 'layout/main',
            title: '404 - Invalid File Type',
            siteTitle: '404 - Invalid File Type',
            errorMessage: 'Invalid file type: only PDF files are allowed'
        });
    }
    
    // Full file path
    const filePath = path.join(pdfFolder, filename);
    
    // Absolute path to prevent path traversal
    const resolvedPath = path.resolve(filePath);
    const resolvedPdfFolder = path.resolve(pdfFolder);
    
    // Ensure path is within pdfs folder
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
    
    // Check if a file exists (not a directory)
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
    
    // Attach validated path to request obsject for use in route handler
    req.validatedPdfPath = resolvedPath;
    next();
}

module.exports = { checkPdfExists };