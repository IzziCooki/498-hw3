const express = require('express');
const app = express();
const hbs = require('hbs'); 
const { db, createTables } = require('./database');
const path = require('path');
const PORT = process.env.PORT || 1738;
const pdfRoutes = require('./routes/pdf');
const addPdfRoutes = require('./routes/addPdf');
const { getPdfs } = require('./middleware/verifyPdf');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/pdf', pdfRoutes);
app.use('/add-pdf', addPdfRoutes);


app.get('/', getPdfs, (req, res) => {
    res.render('home', {
        layout: 'layout/main',
        title: 'DevOps PDF Library',
        siteTitle: 'DevOps PDF Library',
        pdfs: req.pdfs || []
    });
});

// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).render('404Page', {
        layout: 'layout/main',
        title: '404 - Page Not Found',
        siteTitle: '404 - Page Not Found'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});