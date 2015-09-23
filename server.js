///////////////////////////////////////////////////////////////////////////

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var nodemailer = require('nodemailer');
//var pg = require('pg');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var userProvider = require('./userprovider-memory'); // DB LOCAL
var userProvider = require('./userprovider-pg'); // POSTGRESQL
var subscribedProvider = require('./subscribedprovider-pg'); // POSTGRESQL
//var articleProvider = require('./articleprovider-memory'); // DB LOCAL
var articleProvider = require('./articleprovider-pg'); // POSTGRESQL

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
        done(err, user.length ? user[0] : null);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        //process.nextTick(function () {
            userProvider.findByUsername(username, function(err, users) {
                if (err) {
                    return done(err);
                }

                if (users.length == 0) {
                    return done(null, false, { message: 'Unknown user ' + username });
                }

                if (users[0].password != password) {
                    //console.log("bad password " + users[0].password + " " + password);
                    return done(null, false, { message: 'Invalid password' }); 
                }
                return done(null, users[0]);
            })
        //});
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

// emailer (subscribe form, signup)
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'noreply@dual-aperture.com',
        pass: 'ycha2784'
    }
});


// use body-parser middleware for parsing urlencoded POST bodys
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

// /public - static assets
app.use(express.static(__dirname + '/public'));

// index page 
app.get('/', function(req, res) {
    res.render('pages/index', {
        title : 'Dual Aperture International',
        user: req.user
    });
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about', {
        title : 'Dual Aperture International - About',
        user: req.user
    });
});

// faq page 
app.get('/faq', function(req, res) {
    res.render('pages/faq', {
        title : 'Dual Aperture International - FAQ',
        user: req.user
    });
});

// press page 
app.get('/press', function(req, res) {
    res.render('pages/press', {
        title : 'Dual Aperture International - Press',
        user: req.user
    });
});

// careers page 
app.get('/careers', function(req, res) {
    res.render('pages/careers', {
        title : 'Dual Aperture International - Careers',
        user: req.user
    });
});

// blog posts; replaced by NEW blog posts page
/*
app.get('/blog_posts', function(req, res) {
    res.render('pages/blog_posts', {
        title : 'Dual Aperture International - Blog',
        user: null
    });
});
*/


/////// NEW

// login page 
app.get('/login', function(req, res) {
    if (req.user && req.user.role == "admin") {
        res.redirect('/manage');
        return;
    }

    if (req.user) {
        res.redirect('/profile');
        return;
    }

    res.render('pages/login', {
        title : 'Dual Aperture International - Login',
        user : null
    });
});

// POST /login
app.post('/login', urlencodedParser, function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (!user) {
            return res.json({
                success: false,
                error: info.message
            });
        }

        req.logIn(user, function(err) {
            return res.json({
                success: err ? false : true,
                username: user.username
            });
        });
    })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

// signup page 
app.get('/signup', function(req, res) {
    if (req.user) {
        res.redirect('/profile');
        return;
    }

    res.render('pages/signup', {
        title : 'Dual Aperture International - Signup',
        user : null
    });
});

// POST /signup
app.post('/signup', urlencodedParser, function(req, res, next) {
    var fields = {
        email: req.param('email'),
        username: req.param('username'),
        password: req.param('password'),
        company: req.param('company'),
        interests: req.param('interests'),
        interestsOther: req.param('interestsOther'),
        subscribe: req.param('subscribe')     
    };

    console.log(fields);

    userProvider.save(
        fields, 
        function(err) {
            res.json({
                success: err ? false : true,
                error: err
            });

            if (err){
                return;
            }

            // user created! send welcome email
            var mailOpts = {
                from: 'noreply@dual-aperture.com',
                to: fields.email,
                subject: 'Welcome to Dual-Aperture, ' + fields.username,
                text: 'Thanks for signing up as a DualAperture.com site user!\n\nThis email confirms your signup was successful.\n\nYou can login here:\nhttp://www.dualaperture.com/login\n\nDual Aperture\ndual-aperture.com'
            };

            transporter.sendMail(mailOpts, function(err2, response){
                if(err2){
                    console.log("Error sending welcome email! " + err2);
                }

                // subscribe checked?
                if (!fields.subscribe){
                    return;
                }

                subscribedProvider.save( fields.email, function(err3, result){
                    if (err3){
                        console.log("Error subscribing on signup! " + err3);
                        return;
                    }

                    console.log("Subscriber added on signup: " + result);
                });
            });
        }
    );
});

// user profile page (shown after non-admin login)
app.get('/profile', function(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }

    console.log(req.user);

    subscribedProvider.findByEmail( req.user.email, function(err, result){
        if (err) { 
            return next(err);
        }

        res.render('pages/profile', {
            title : 'Dual Aperture International - User Profile',
            user: req.user,
            subscribed: result.length > 0
        });
    });
});

// manage page (shown after admin login)
app.get('/manage', function(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }

    // redirect to profile page if non-admin user tries to access
    if (req.user.role != "admin"){
        res.redirect('/profile');
        return;
    }

    // assemble result of two queries
    var model = {
        title: 'Dual Aperture International - Manage',
        user: req.user,
        subscribers: [], // from q1
        emaillist: [], // generated from subscribers
        da_users: [] // from q2
    };

    // q1
    subscribedProvider.findAll( function(err, result){
        if (err){
            return next(err);
        }
        model.subscribers = result || [];
        // generate subscriber emaillist string (for textarea)
        model.emaillist = model.subscribers.map(function(item){ return item.emailaddr; });

        // q2
        userProvider.findAll( function(err2, result2){
            if (err2){
                return next(err2);
            }

            model.da_users = result || [];

            res.render('pages/manage', model);
        });
    });
});


// blog posts (admin access only)
app.get('/blog', function(req, res, next){
    articleProvider.findAll( function(err, articles){
        if (err){ return next(err); }

        res.render('pages/blog', {
            title : 'Dual Aperture International - Blog',
            articles : articles,
            user: req.user
        });
    });
});

// AJAX services for blog management
app.post('/blog', urlencodedParser, function(req, res){
    if (!req.user){
        res.json({
            success: false,
            error: "You are not logged in!"
        });
    }

    if (req.user.role !== "admin"){
        res.json({
            success: false,
            error: "You are not authorized to create blog posts!"
        });
    }

    articleProvider.save(
        {
            title: req.param('title'),
            body: req.param('body')
        }, 
        function(err, addedArticles) {
            res.json({
                success: err ? false : true,
                error: err,
                added: addedArticles
            });
        }
    );
});
app.put('/blog/:id', urlencodedParser, function(req, res){
    if (!req.user){
        res.json({
            success: false,
            error: "You are not logged in!"
        });
    }

    articleProvider.update(
        {
            id: req.params.id,
            title: req.param('title'),
            body: req.param('body')
        }, 
        function(err) {
            res.json({
                success: err ? false : true,
                error: err
            });
        }
    );
});
app.delete('/blog/:id', function(req, res){
    if (!req.user){
        res.json({
            success: false,
            error: "You are not logged in!"
        });
    }

    articleProvider.delete(
        req.params.id, 
        function(err) {
            res.json({
                success: err ? false : true,
                error: err
            });
        }
    );
});

// single post page
app.get('/blog/:id', function(req, res, next) {
    articleProvider.findById(req.params.id, function(err, article) {
        if (err){ return next(err); }

        res.render('pages/blog_entry', {
            title: article.title,
            article: article,
            user: req.user
        });
    });
});


// subscribe form
app.post('/subscribe', urlencodedParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    // store in the db
    subscribedProvider.save(
        req.param('email'),
        function(err, subscriberEmail) {
            if (err){
                res.json({
                    success: true,
                    error: err
                });
                return;
            }

            // confirmation email can be supressed in manage page
            if (!req.param('sendConf')){
                res.json({
                    success: true
                });
                return;
            }

            var mailOpts = {
                from: 'noreply@dual-aperture.com',
                to: subscriberEmail,
                subject: 'Dual-Aperture Subscription Request',
                text: 'Thanks for subscribing to the Dual Aperture mailing list!\n\nThis email confirms your subscription.\n\nDual Aperture\ndual-aperture.com'
            };

            transporter.sendMail(mailOpts, function(err, response){
                if(err){
                    res.json({
                        error: err, 
                        response: response
                    });
                } else {
                    res.json({
                        success: true, 
                        response: response
                    });
                }
            });
        }
    );
});

app.delete('/subscriber/:id', function(req, res){
    if (!req.user){
        res.json({
            success: false,
            error: "You are not logged in!"
        });
    }

    subscribedProvider.delete(
        req.params.id, 
        function(error) {
            res.json({
                success: error ? false : true,
                error: error
            });
        }
    );
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
