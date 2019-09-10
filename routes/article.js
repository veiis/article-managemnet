const express = require('express');
const router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');

// Add Route
router.get('/add', isLoggedIn, (req, res) => {
    res.render('add_article', {
        title: 'Add a Article'
    })
});

// Get Single Article
router.get('/view/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user) => {
            if (err) {
                console.log(err);
                return;
            } else {
                res.render('article', {
                    article,
                    author: user.name
                })
            }
        })

    });
});

// Add Submit POST Route
router.post('/add', (req, res) => {
    req.checkBody('title', 'Title is Required').notEmpty();
    req.checkBody('body', 'Body is Required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    } else {
        let article = Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save((err) => {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form 
router.get('/edit/:id', isLoggedIn, (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (article.author != req.user._id) {
            req.flash('danger', 'Unauthorized!');
            res.redirect('/');
        } else {
            if (err) {
                console.log(err);
                return;
            } else {
                res.render('edit_article', {
                    title: 'Edit Article Form',
                    article
                })
            }
        }
    });
});


// Update Submit POST Route
router.post('/edit/:id', (req, res) => {
    let article = {

    }
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id }


    Article.update(query, article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('danger', 'Article Updated!')
            res.redirect('/');
        }
    });
});

router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = {
        _id: req.params.id
    }

    Article.findById(req.params.id, (err, article) => {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send('Success');
                }
            })
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'You Cant see the Page, Please login first.');
        res.redirect('/users/login');
    }
}


module.exports = router;