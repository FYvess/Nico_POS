const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, image TEXT, description TEXT, rating REAL, price REAL)");
});

app.get('/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.post('/products', (req, res) => {
    const { name, image, description, rating, price } = req.body;
    db.run(`INSERT INTO products (name, image, description, rating, price) VALUES (?, ?, ?, ?, ?)`,
        [name, image, description, rating, price],
        function (err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": { id: this.lastID, name, image, description, rating, price }
            });
        });
});

app.put('/products/:id', (req, res) => {
    const { name, image, description, rating, price } = req.body;
    db.run(`UPDATE products SET name = ?, image = ?, description = ?, rating = ?, price = ? WHERE id = ?`,
        [name, image, description, rating, price, req.params.id],
        function (err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": { id: req.params.id, name, image, description, rating, price }
            });
        });
});

app.delete('/products/:id', (req, res) => {
    db.run(`DELETE FROM products WHERE id = ?`, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", "changes": this.changes });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});