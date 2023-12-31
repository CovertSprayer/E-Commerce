const express = require('express');
const Product = require('../models/product');
const Review = require('../models/review');
const router = express.Router();
const { validateProduct, isLoggedIn, isSeller, isProductAuthor } = require('../middleware');


router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products/index', { products });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

router.get('/products/new', isLoggedIn, isSeller, (req, res) => {

    try {
        res.render('products/new');
    }

    catch (e) {
        res.render('error', { err: e.message });
    }
})

router.post('/products', isLoggedIn, isSeller, validateProduct, async (req, res) => {

    try {
        const {name, img, price, desc} = req.body;
        await Product.create({name, img, price, desc, author: req.user._id});

        req.flash('success', 'Added your product successfully!');

        res.redirect('/products');
    }

    catch (e) {
        res.render('error', { err: e.message });
    }
})

router.get('/products/:id', async (req, res) => {


    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('reviews');
        res.render('products/show', { product });
    }
    catch (e) {
        res.render('error', { err: e.message });
    }
})

router.get('/products/:id/edit', isLoggedIn, isSeller, isProductAuthor, async (req, res) => {


    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        res.render('products/edit', { product });
    }

    catch (e) {
        res.render('error', { err: e.message });
    }
})

router.patch('/products/:id', isLoggedIn, isProductAuthor, validateProduct, async (req, res) => {


    try {
        const { id } = req.params;

        req.flash('success', 'Edited your product successfully!');

        await Product.findByIdAndUpdate(id, req.body);
        res.redirect(`/products/${id}`);
    }

    catch (e) {
        res.render('error', { err: e.message });
    }
})

router.delete('/products/:id', isLoggedIn, isSeller, isProductAuthor, async (req, res) => {


    try {
        const { id } = req.params;

        // const product = await Product.findById(id);
        // for (let reviewId of product.reviews) {
        //     await Review.findByIdAndDelete(reviewId);
        // }

        await Product.findByIdAndDelete(id);

        req.flash('success', 'Deleted your product successfully!');

        res.redirect(`/products`);
    }

    catch (e) {
        res.render('error', { err: e.message });
    }
})



module.exports = router;
