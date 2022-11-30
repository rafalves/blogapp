const express = require('express');
const adminRouter = express.Router();
const Category = require('../models/Category');
const { isAdmin } = require('../helpers/isAdmin')

adminRouter.get('/admin/categories', isAdmin, async (req, res) => {
    try {
        const categories = await Category.find().sort({'_id': -1}).lean();
        res.render('admin/categories', {category: categories});
    } catch (err) {
        req.flash('error_msg', 'Error to load the DB: ' + err);
        res.rendirect('/admin/categories');
    }
});

adminRouter.get('/admin/categories/add', isAdmin, (req, res) => {
    res.render('admin/add_category');
})

adminRouter.post('/admin/categories/new', isAdmin, async (req, res) => {
    try {
        const errors = [];
        if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
            errors.push({text: 'Please type the Name'}) 
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            errors.push({text: 'Please type the Slug'});
        } 
        if (req.body.name.length < 2 || req.body.slug < 2) {
            errors.push({text: 'Name or Slug cannot have less than 2 characters'});
        }

        if(errors.length > 0) {
            return res.render('admin/add_category', {errors: errors});
        } else {
            const response = {
                name: req.body.name,
                slug: req.body.slug
            };
            let category = new Category(response);
            category =  await category.save();
        req.flash('success_msg', 'Category created successfully');
            return res.redirect('/admin/categories');
        }
    } catch (err) {
        res.render('admin/index');
    }
});

adminRouter.get('/admin/categories/edit/:id', isAdmin, async (req, res) => {
    try {
        const category = await Category.findOne({_id: req.params.id}).lean();
        res.render('admin/edit_category', {category});
    } catch(err) {
        req.flash('error_msg', `Couldn't find this category: ` + err);
        res.rendirect('/admin/categories');
    }
})

adminRouter.post('/admin/categories/edit', isAdmin, async (req, res) => {
    try {
        const { id, name, slug } = req.body; 
        let category = await Category.findOne({_id: id});
        if (category == null) throw 'Category not find in the DataBase';
        category.name = name;
        category.slug = slug;
        await category.save();
        req.flash('success_msg', 'Category edited with success!');
        res.redirect('/admin/categories');
    } catch(err) {
        req.flash('error_msg', `Error to edit the category: ${err}`);
        res.redirect('/admin/categories');
    }
})

adminRouter.post('/admin/categories/delete', isAdmin, async (req, res) => {
    try {
        const { id } = req.body;
        await Category.deleteOne({_id: id });
        req.flash('success_msg', 'Category deleted successfully');
        res.redirect("/admin/categories");
    } catch (err) {
        req.flash('error_msg', `Error to delete category: ${err}`);
        res.redirect('admin/categories');
    }
})


module.exports = adminRouter;