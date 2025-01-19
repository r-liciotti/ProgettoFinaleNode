const express = require('express');
const app = express();
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const interactionsRoutes = require('./routes/interactions');

app.use((req, res, next) => {
    res.success = (data) => {
        res.status(200).json({
            status: 'success',
            data
        });
    };

    res.error = (statusCode = 500, message = 'Internal Server Error', details = null) => {
        console.error(`Error [${statusCode}]: ${message}`, details);
        res.status(statusCode).json({
            status: 'error',
            message,
            ...(details && { details }) // Aggiungi solo se `details` non è null
        });
    };

    next();
});

app.use(express.json());



app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/interactions', interactionsRoutes);



module.exports = app;