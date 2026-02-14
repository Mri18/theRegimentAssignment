const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const todoRoutes = require('./modules/todos/todos.routes');
const errorHandler = require('./middlewares/error.middleware');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/todos', todoRoutes);
app.use('/uploads', express.static('uploads'));
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use(errorHandler);

module.exports = app;