// Imports
    const express = require('express')
    const { engine } = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    //const mongoose = require('mongoose')

// Configs
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json)
    // Handlebars
        app.engine('handlebars', engine());
        app.set('view engine', 'handlebars');
        app.set('views', './views');
// Routes

// Others
    const PORT = process.env.PORT || 8081
    app.listen(PORT, () => {
        console.log('Server running')
    })