const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');



mongoose.connect('mongodb://localhost:27017/nefullapp', { useNewUrlParser: true });
let db = mongoose.connection;

// Check Connection
db.once('open', () => {
    console.log('Connected to Mongodb');
})

// Check for DB errors
db.on('error', (err) => {
    console.log(err);
});

// Init App
const app = express();

// Bring in Modules
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// Set public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Body PArser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Expres Session
app.use(session({
    secret: 'veisiwakeup',
    resave: true,
    saveUninitialized: true,
}));

// Exoress Messages Middleware
app.use(require('connect-flash')()); 
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;
        while(name.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Home Route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Hello',
                articles
            });
        }
    });
});


// Add Route
app.get('/article/add', (req, res) => {
    res.render('add_article', {
        title: 'Add a Article'
    })
});

// Get Single Article
app.get('/article/view/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.render('article', {
                article
            })
        }
    });
});

// Add Submit POST Route
app.post('/article/add', (req, res) => {
    let article = Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Added');
            res.redirect('/');
        }
    });
});

// Load Edit Form 
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.render('edit_article', {
                title: 'Edit Article Form',
                article
            })
        }
    });
});


// Update Submit POST Route
app.post('/article/edit/:id', (req, res) => {
    let article = {

    }
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id}


    Article.update(query, article, (err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

app.delete('/article/:id', (req, res) => {
    let query = {
        _id: req.params.id
    }

    Article.remove(query, (err) => {
        if(err) {
            console.log(err)
        } else {
            res.send('Success');
        }
    })
});

// Start Server
app.listen(3000, () => {
    console.log('Server is Runing on 3000!');
});