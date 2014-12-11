var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
var db = require('./models');
var session = require('express-session');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret:'s14y3rR00lz',
    resave: false,
    saveUnitialized: true
}))

app.use(function(req,res, next) {
    req.getUser = function() {
        return req.session.user || false;
    }
    next();
})

app.get('/',function(req,res){
    var user = req.getUser();
    res.render('index',{user:user});
});

app.get('/restricted',function(req,res){
    if(req.getUser()){
        res.render('restricted');
    } else {
        res.send('ACCESS DENIED')
    }
});

//login form
app.get('/auth/login',function(req,res){
    res.render('login');
});

app.post('/auth/login',function(req,res){
    //do login here (check password and set session value)
    db.user.find({where:{email:req.body.email}}).then(function(userObj) {
        if(userObj){
            bcrypt.compare(req.body.password, userObj.password, function(err, match) {
                if (match === true) {
                    req.session.user = {
                        id: userObj.id,
                        email: userObj.email,
                        name: userObj.name
                    }
                    res.redirect('/');
                } else {
                    res.send('not woot!');
                }
            })
        }else{
            res.send('unkown jerkwad');
        }
    });
    //user is logged in forward them to the home page
    // res.redirect('/');
});

//sign up form
app.get('/auth/signup',function(req,res){
    res.render('signup');
});

app.post('/auth/signup',function(req,res){
    //do sign up here (add user to database)
    db.user.findOrCreate(
        {
            where: {email: req.body.email}, 
            defaults: {email: req.body.email, name: req.body.name, password: req.body.password}
        }).spread(function(user, created) {
        if (created == true) {
            res.send({thing: 'User Created'});
        } else {
            res.send({thing:'User Exists'});
        }
          
    }).catch(function(error) {
        res.send(error);
    })
    //user is signed up forward them to the home page
    // res.redirect('/');
});

//logout
//sign up form
app.get('/auth/logout',function(req,res){
    delete req.session.user;
    res.redirect('/');
});

app.listen(3000);