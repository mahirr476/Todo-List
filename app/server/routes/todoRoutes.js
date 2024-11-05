const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const authenticateJWT = require('../middleware/authenticateJWT');

// Create a new todo
router.post('/create', authenticateJWT, (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    if (!title) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const checkQuery = 'SELECT * FROM todos WHERE title = ? AND created_by = ?';

    db.query(checkQuery, [title, userId], (err, results) => {
        if(err) {
            return res.status(500).json({ message: 'Error checking' });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Title already exists' });
        }
        const query = 'INSERT INTO todos (title, created_by) VALUES (?, ?)';
        db.query(query, [title, userId], (err, results) => {
            if (err) {
                // console.error('Database error:', err.message);
                return res.status(500).json({ message: 'Error creating' });
            }
            res.status(201).json({ id: results.insertId, title, created_by: userId });
        });
    });
});

// Get all todos
router.get('/get-all', authenticateJWT, (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT * FROM todos WHERE created_by = ?';

    db.query(query, [userId], (err, results) => {
        if(err) {
            return res.status(500).json({ message: 'Error retrieving' });
        }
        res.json(results);
    });
});

// Update todo
router.put('/update/:id', authenticateJWT, (req, res) => {
    const id = req.params.id;
    const { title, completed } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Fields are required' });
    }

    const checkQuery = 'SELECT completed FROM todos WHERE id = ? AND created_by = ?';
    db.query(checkQuery, [id, req.user.id], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Error checking' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (results[0].completed) {
            return res.status(400).json({ message: 'Cannot update a completed todo' });
        }

        const updateQuery = 'UPDATE todos SET title = ?, completed = ? WHERE id = ? AND created_by = ?';
        db.query(updateQuery, [title, completed, id, req.user.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating todo' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.json({ message: 'Todo updated successfully' });
        });
    });
});

// Update complete status
router.put('/status/:id', authenticateJWT, (req, res) => {
    const id = req.params.id;
    const { completed } = req.body;

    if (completed === undefined) {
        return res.status(400).json({ message: 'Fields are required' });
    }
    const query = 'UPDATE todos SET completed = ? WHERE id = ? AND created_by = ?';

    db.query(query, [completed, id, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Status updated successfully' });
    });
});


// Delete todo
router.delete('/delete/:id', authenticateJWT, (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM todos WHERE id = ? AND created_by = ?';

    db.query(query, [id, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting todo' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    });
});

module.exports = router;