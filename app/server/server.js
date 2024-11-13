const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authenticateJWT = require('./middleware/authenticateJWT');
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api/todos', todoRoutes);

// Protected route example
app.get('/api/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.user.id });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`); // Use backticks here
});
