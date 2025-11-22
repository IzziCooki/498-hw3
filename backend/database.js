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

const insertStmt = db.prepare(`
    INSERT INTO pdfs (filename, filepath, title, subject, author)
    VALUES (?, ?, ?, ?, ?)
  `);



module.exports = { db, createTables, insertStmt };
