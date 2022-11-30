// Imports
    const express = require('express');
    const { engine } = require('express-handlebars');
    const app = express();
    const mongoose = require('mongoose');
    const path = require('path');
    const session = require('express-session');
    const flash = require('connect-flash');
    const admin = require('./routes/admin');
    const post = require('./routes/posts');
    const user = require('./routes/user');
    const cookieParser = require('cookie-parser');
    const Post = require('./models/Post');
    const Category = require('./models/Category');
    const passport = require('passport');
    require('./config/auth')(passport);


// Configs
    // Session
        app.use(cookieParser('secret'));
        app.use(session({
            cookie: { maxAge: 60000 },
            saveUninitialized: false,
            resave: false,
            secret: 'secret'
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next();
        });
    // Parser
        app.use(express.json());
        app.use(express.urlencoded({ extended: true}));
    // Handlebars
        app.engine('handlebars', engine());
        app.set('view engine', 'handlebars');
        app.set('views', './views');
    // Public
        app.use(express.static(path.join(__dirname, 'public')));
    // Mongoose
        mongoose.connect('mongodb://127.0.0.1:27017/blogapp').then(()=>{
            console.log('Connected to MongoDB database: blogapp');
        }).catch((err)=> {
            console.log('Error to connect to MongoDB: ' + err);
        });

// Routes
    app.use(admin);
    app.use(post);
    app.use(user);
// Others
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
        console.log('Server running');
    });

// Default Route
    app.get('/', async (req, res) => {
        try {
            const posts = await Post.find().populate('category').sort({'data': 'desc'}).lean();
            res.render('index', {posts: posts})
        } catch (err) {
            req.flash('error_msg', `Post couldn't be loaded: ${err}`)
            res.redirect('/404')
        }
    });

    app.get('/posts/:slug', async (req, res) => {
        try {
            const post = await Post.findOne({'slug': req.params.slug}).lean()
            if (post) {
                res.render('post/index', {post: post})
            } else {
                req.flash('error_msg', `This post does not exist`)
                res.redirect('/')
            }
        } catch (err) {
            req.flash('error_msg', `This post does not exist: ${err})`)
                res.redirect('/')
        }
    })

    app.get('/categories', async (req, res)=> {
        try {
            const categories = await Category.find().lean()
            res.render('category/index', {categories: categories})
        } catch (err) {
            req.flash('error_msg', `Error when trying to load categories`)
            res.redirect('/')
        }
    })

    app.get('/categories/:slug', async (req, res) => {
        try {
            const category = await Category.findOne({slug: req.params.slug}).lean()
            if (category) {
                const posts = await Post.find({category: category._id}).lean()
                res.render('category/posts', {posts: posts, category: category})
            } else {
            req.flash('error_msg', `This category does not exist`)
            res.redirect('/')
            }
        } catch (err){
            req.flash('error_msg', `Error when trying to load this category: ${err}`)
            res.redirect('/')
        }
    })


    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })