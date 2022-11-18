// Imports
    const express = require('express');
    const { engine } = require('express-handlebars');
    const app = express();
    //const mongoose = require('mongoose');
    const path = require('path')
    const admin = require('./routes/admin');

// Configs
    // JSON
        app.use(express({extended: true}));
        app.use(express.json());
    // Handlebars
        app.engine('handlebars', engine());
        app.set('view engine', 'handlebars');
        app.set('views', './views');
    // Public
        app.use(express.static(path.join(__dirname, 'public')));

// Routes
    app.use('/admin', admin);
// Others
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
        console.log('Server running');
    });