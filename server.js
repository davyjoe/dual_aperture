///////////////////////////////////////////////////////////////////////////

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var nodemailer = require('nodemailer');
//var pg = require('pg');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var articleProvider = require('./articleprovider-memory'); // DB LOCAL
var articleProvider = require('./articleprovider-pg'); // POSTGRESQL
var userProvider = require('./userprovider-memory'); // DB LOCAL

var app = express();

///////////////////////////////////////////////////////////////////////////

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

///////////////////////////////////////////////////////////////////////////

//app.use(express.logger());
//app.use(cookieParser());
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(expressSession({ 
    secret: 'da da da',
    resave: true,
    saveUninitialized: true
}));
//app.use(app.router);


// Passport session setup
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    userProvider.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            userProvider.findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                return done(null, user);
            })
        });
    }
));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);

///////////////////////////////////////////////////////////////////////////

// dev-only!
//if (process.env.NODE_ENV === 'development'){
if (app.get('env') === 'development'){
    //console.log("ENVIRONMENT VARS", process.env);
}

// DB
/*
var connection = new pg.Client(process.env.DATABASE_URL);
connection.connect(function(err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
});
connection.query("CREATE TABLE IF NOT EXISTS da_posts(id SERIAL PRIMARY KEY, title VARCHAR(128) not null, body text, createdate bigint");
*/

///////////////////////////////////////////////////////////////////////////

// use body-parser middleware for parsing urlencoded POST bodys
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

// /public - static assets
app.use(express.static(__dirname + '/public'));

// index page 
app.get('/', function(req, res) {
    res.render('pages/index', {
        title : 'Dual Aperture International'
    });
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about', {
        title : 'Dual Aperture International - About'
    });
});

// faq page 
app.get('/faq', function(req, res) {
    res.render('pages/faq', {
        title : 'Dual Aperture International - FAQ'
    });
});

// press page 
app.get('/press', function(req, res) {
    res.render('pages/press', {
        title : 'Dual Aperture International - Press'
    });
});

// blog posts  TODO: replace with NEW blog posts page
app.get('/blog_posts', function(req, res) {
    res.render('pages/blog_posts', {
        title : 'Dual Aperture International - Blog'
    });
});


// NEW blog posts
app.get('/blog', function(req, res){
    articleProvider.findAll( function(error, articles){
        res.render('pages/blog', {
            title : 'Dual Aperture International - Blog',
            articles : articles,
            user: req.user
        });
    });
});

// AJAX services for blog management
// TODO: auth requests?
app.post('/blog', urlencodedParser, function(req, res){
    articleProvider.save(
        {
            title: req.param('title'),
            body: req.param('body')
        }, 
        function(error, addedArticles) {
            res.json({
                success: error ? false : true,
                error: error,
                added: addedArticles
            });
        }
    );
});
app.put('/blog/:id', urlencodedParser, function(req, res){
    articleProvider.update(
        {
            id: req.params.id,
            title: req.param('title'),
            body: req.param('body')
        }, 
        function(error) {
            res.json({
                success: error ? false : true,
                error: error
            });
        }
    );
});
app.delete('/blog/:id', function(req, res){
    articleProvider.delete(
        req.params.id, 
        function(error) {
            res.json({
                success: error ? false : true,
                error: error
            });
        }
    );
});

// single post page
app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('pages/blog_entry', {
            title: article.title,
            article: article,
            user: req.user
        });
    });
});

// POST /login
app.post('/login', urlencodedParser, function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.json({
                success: false,
                error: info.message
            });
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({
                success: true,
                username: user.username
            });
        });
    })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/blog');
});

// contact form mailer
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'noreply@dual-aperture.com',
        pass: 'ycha2784'
    }
});
app.post('/contact', urlencodedParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    // TODO: emails should be stored and displayed on an admin page
    var mailOpts = {
        from: 'noreply@dual-aperture.com',
        to: 'davyjoe@gmail.com',
        subject: 'Dual-Aperture Subscription Request Submitted',
        text: 'email: ' + req.body.email
    };
    transporter.sendMail(mailOpts, function(error, response){
        if(error){
            //console.log(error);
            res.send({
                error: error, 
                response: response
            });
        } else {
            res.send({
                success: true, 
                response: response
            });
        }
    });
});

// server error
app.use(function(err, req, res, next) {
  if (app.get('env') === 'development') {
    console.error(err.stack);
  }
  res.status(500).send('Something broke!');
});

// 404
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

///////////////////////////////////////////////////////////////////////////

var server = app.listen(app.get('port'), function () {
  if (app.get('env') === 'development') {
      var host = server.address().address;
      var port = server.address().port;
      console.log('server running on http://%s:%s', host, port);
  }
});

module.exports = app;
