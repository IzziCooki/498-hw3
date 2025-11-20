const express = require('express');
const app = express();
const session = require('express-session');
const hbs = require('hbs'); 
const path = require('path');
const PORT = process.env.PORT || 1738;
const pdfRoutes = require('./routes/pdf');
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/pdf', pdfRoutes);




app.get('/', (req, res) => {

    res.render('home', {
        layout: 'layout/main',
        title: 'DevOps PDF Library',
        siteTitle: 'DevOps PDF Library',
        pdfs: pdfs  
    });

});

const pdfs = [
    {
        title: 'DevOps for Web Development',
        description: 'This is a PDF on DevOps for Web Development',
        filename: 'DevOps for Web Development.pdf'
    }
];



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});