const express = require('express')
const postRouter = express.Router()
const Category = require('../models/Category')
const Post = require('../models/Post')
const { isAdmin } = require('../helpers/isAdmin')

postRouter.get('/admin/posts', isAdmin, async (req, res) => {
    try {
        const posts = await Post.find().populate('category').sort({'date': 'desc'}).lean();
        res.render('admin/posts', {posts: posts});
    } catch (err) {
        req.flash('error_msg', 'Error to load the DB: ' + err);
        res.rendirect('/admin/categories');
    }
})

postRouter.get('/admin/posts/add', isAdmin, async (req, res)=> {
    try {
    const categories = await Category.find().sort({'slug': 'asc'}).lean(); 
    res.render('admin/add_posts', {categories: categories});
    } catch (err) {
        res.render('admin/index')
    }
})

postRouter.post('/admin/posts/create', isAdmin, async (req, res) => {
    try {
    var errors = []

    if (req.body.category == "0") {
        errors.push({text: 'Invalid category, please select one category'})
    }
    if (errors.length > 0) {
        res.render('admin/add_posts', {errors: errors})
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }
        await new Post(newPost).save()
        req.flash('success_msg', 'Post created with success')
        res.redirect('/admin/posts')
    }
    } catch (err) {
        req.flash('error_msg', `Error when trying to add a new post ${err}`)
        res.redirect('/admin/posts') 
    }
})

postRouter.get('/admin/posts/edit/:id', isAdmin, async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id}).lean()
        const categories = await Category.find().lean()
        req.flash('success_msg', 'Post edited with success')
        res.render('admin/edit_post', {categories: categories, post: post})
    } catch (err) {
        req.flash('error_msg', `Error when trying to load post data ${err}`)
        res.redirect('/admin/posts')
    }
})

postRouter.post('/admin/posts/edit', isAdmin, async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.body.id})
        post.title = req.body.title
        post.slug = req.body.slug
        post.description = req.body.description
        post.content = req.body.content
        post.category = req.body.category
        await post.save()
        req.flash('success_msg', 'Post edited with success')
        res.redirect('/admin/posts')
        } catch (err) {
        req.flash('error_msg', `Error when trying to edit: ${err}`)
        res.redirect('/admin/posts')
        }
})

module.exports = postRouter;