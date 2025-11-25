const { db } = require('../database');

// Middleware to fetch all PDFs from the database

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

module.exports = { getPdfs };