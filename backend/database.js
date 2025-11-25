const sqlite3 = require('sqlite3').verbose();
const { appendFile } = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db', 'app.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
    createTables();
    seedData();
});
//PDF filename + path
//– Display title/name
//– Description
function createTables() {
    db.run(`
  CREATE TABLE IF NOT EXISTS pdfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    title TEXT,
    author TEXT,
    subject TEXT,
    keywords TEXT,
    pages INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
    `, (err) => {
        if (err) console.error('Error creating pdfs table:', err);
    });
}


// Prepare an SQL statement for inserting a new PDF record into the database
const insertStmt = db.prepare(`
    INSERT INTO pdfs (filename, filepath, title, subject, author)
    VALUES (?, ?, ?, ?, ?)
  `);

const staticPdfs = [
    {
        filename: 'Implementing DevOps on AWS.pdf',
        filepath: 'pdfs/Implementing DevOps on AWS.pdf',
        title: 'Implementing DevOps on AWS',
        author: 'AWS',
        subject: 'DevOps'
    },
    {
        filename: 'Continuous Delivery and DevOps - A Quickstart Guide.pdf',
        filepath: 'pdfs/Continuous Delivery and DevOps - A Quickstart Guide.pdf',
        title: 'Continuous Delivery and DevOps',
        author: 'Unknown',
        subject: 'DevOps'
    },
    {
        filename: 'DevOps for Web Development.pdf',
        filepath: 'pdfs/DevOps for Web Development.pdf',
        title: 'DevOps for Web Development',
        author: 'Unknown',
        subject: 'DevOps'
    }
];

function seedData() {
    staticPdfs.forEach((pdf) => {
        db.get("SELECT id FROM pdfs WHERE filename = ?", [pdf.filename], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
            if (!row) {
                insertStmt.run(pdf.filename, pdf.filepath, pdf.title, pdf.subject, pdf.author, (err) => {
                    if (err) {
                        console.error('Error inserting seed data:', err.message);
                    } else {
                        console.log(`Inserted seed data for ${pdf.filename}`);
                    }
                });
            }
        });
    });
}

module.exports = { db, createTables, insertStmt, staticPdfs };
