require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 9200;

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    db.query('SELECT * FROM notes ORDER BY created_at DESC LIMIT 10', (err, results) => {
        if (err) throw err;
        res.render('index', { notes: results });
    });
});

app.post('/add', (req, res) => {
    const content = req.body.content;
    db.query('INSERT INTO notes (content) VALUES (?)', [content], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const content = req.body.content;
    db.query('UPDATE notes SET content = ? WHERE id = ?', [content, id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/load_more/:offset', (req, res) => {
    const offset = parseInt(req.params.offset, 10);
    db.query('SELECT * FROM notes ORDER BY created_at DESC LIMIT 10 OFFSET ?', [offset], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://192.168.50.214:${port}`);
});
