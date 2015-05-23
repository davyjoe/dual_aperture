var express = require('express');
var handlebars = require('express');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser());

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

// about page 
app.get('/faq', function(req, res) {
    res.render('pages/faq', {
        title : 'Dual Aperture International - FAQ'
    });
});

// about page 
app.get('/press', function(req, res) {
    res.render('pages/press', {
        title : 'Dual Aperture International - Press'
    });
});

// about page 
app.get('/blog_posts', function(req, res) {
    res.render('pages/blog_posts', {
        title : 'Dual Aperture International - Blog'
    });
});

// about, blog_posts, faq, press

// contact form (ajax)
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'noreply@dual-aperture.com',
        pass: 'ycha2784'
    }
});
app.post('/contact', function (req, res) {
    var mailOpts = {
        from: 'noreply@dual-aperture.com',
        to: 'davyjoe@gmail.com',
        subject: 'Dual-Aperture Subscription Request Submitted',
        text: 'email: ' + req.body.email
    };
    transporter.sendMail(mailOpts, function(error, response){
        if(error){
            console.log(error);
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
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});


var server = app.listen(app.get('port'), function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
