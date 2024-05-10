require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');


const app = express();
const port = 5000 || process.env.PORT


app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: new Date (Date.now() + (30 * 24 * 60 * 60 *1000)) // 30days
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended: true}))
app.use(express.json())

connectDB();

// Static Files
app.use(express.static('public'));

// Template Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

app.get('*', function(req, res){
    //res.status(404).send('404 Page not found :(');
    res.status(404).render('404');
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})