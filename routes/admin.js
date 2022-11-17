const { Router } = require('express');
const express = require('express');
const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    res.send('Admin main page');
});

adminRouter.get('/posts', (req, res) => {
    res.send('Posts page');
});

adminRouter.get('/categories', (req, res) => {
    res.send('Categories page');
});

module.exports = adminRouter;