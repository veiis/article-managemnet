const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const dbConfig = require('./config/database');

let Article = require('./models/article');
mongoose.connect(dbConfig.database, { useNewUrlParser: true });
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
    errorFormatter: function (param, msg, value) {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Home Route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Hello',
                articles
            });
        }
    });
});

let article_router = require('./routes/article');
app.use('/article', article_router);

let users_router = require('./routes/users');
app.use('/users', users_router);

// Start Server
app.listen(3000, () => {
    console.log('Server is Runing on 3000!');
});