//Api route to add a PDF to the database


const express = require('express');
const router = express.Router();
const { db } = require('../database');
const path = require('path');
const pdfFolder = path.join(__dirname, '..', 'pdfs');
const { insertStmt } = require('../database');
const multer = require('multer');
const { verifyPdf} = require('../middleware/verifyPdf.js');
const fs = require('fs');

//Use multer to handle file uploads

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, pdfFolder); 
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  

  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});


//upload.single handles single file upload with the field name 'pdfFile'
router.post('/', upload.single('pdfFile'), verifyPdf, (req, res) => {
    const filePath = req.file.path;
    const filename = req.file.filename;
    console.log(req.file);
    try {

        insertStmt.run(filename, filePath, req.body.title, req.body.description, req.body.author);
        return res.redirect('/');

    } catch (error) {
        console.error('Error adding PDF to database:', error);
        res.render('404Page', {
            layout: 'layout/main',
            title: '404 - Error Adding PDF to Database',
            siteTitle: '404 - Error Adding PDF to Database',
            errorMessage: 'Error adding PDF to database: ' + error.message
        });
    }
});


router.get('/', (req, res) => {
    res.render('addPdf', {
        layout: 'layout/main',
        title: 'Add PDF',
        siteTitle: 'Add PDF'
    });
});

module.exports = router;