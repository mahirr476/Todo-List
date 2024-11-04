const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if(err) throw err;
    console.log('Connected to MySQL Database!');
})

//User register route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password  } = req.body;
        // Check if username, email, or password are undefined
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); //The second argument is the salt rounds.
        const query = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)';

        await new Promise((resolve, reject) => {
            db.query(query, [name, hashedPassword, email], (err, result) => {
                if (err) {
                    return reject(err); // Reject the promise on error
                }
                resolve(result); // Resolve on success
            });
        });

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        // console.error('User registration error:', error);
        res.status(500).json({ message: "Server error" });
    } 
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // [1] accesses the second part of the split array, which is the token itself

    if(!token) {
        return res.sendStatus(403);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

//All users get route
// app.get('/users', authenticateJWT, async (req, res) => {
app.get('/users', async (req, res) => {
    try {
        const query = 'SELECT id, name, email FROM users';
        
        const results = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    return reject(err); // Reject the promise on error
                }
                resolve(results); // Resolve with the results
            });
        });

        // Check if results are empty
        if (results.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.json(results);
    } catch (err) {
        console.error('Error retrieving users:', err); // Log the error for debugging
        return res.status(500).json({ message: 'Error retrieving users' });
    }
});


// Update user route
app.put('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password  } = req.body;
    let hashedPassword;

    if(password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?'; 
    //The SET clause is used to define which columns in the table you want to update and with what values.
    //The placeholders are used to prevent SQL injection attacks and to handle input values safely.
    db.query(query, [name, email || null, hashedPassword || null, userId ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating user' });
        }
        if(result.affectedRows === 0) {
            //If the affectedRows is 0, it means that no rows were updated. This could happen if the specified userId doesn't exist in the database.
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    });
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';

    try {
        const [results] = await db.query(query, [email]);

        if (results.length === 0) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        console.log('Token created:', token);
        res.json({ token });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
    }
});


// Protected route
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route', userID: req.user.id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) =>{
    console.log(`Server is running on ${PORT}`);
});
