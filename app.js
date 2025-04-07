const express = require('express');
const db = require('./db');
const app = express();
const PORT = 8001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET all students
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST create a new student
app.post('/students', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql = `INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`;
  db.run(sql, [firstname, lastname, gender, age], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// GET one student
app.get('/student/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

// PUT update a student
app.put('/student/:id', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql = `
    UPDATE students 
    SET firstname = ?, lastname = ?, gender = ?, age = ? 
    WHERE id = ?
  `;
  db.run(sql, [firstname, lastname, gender, age, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// DELETE a student
app.delete('/student/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});
