var express = require('express');
var path = require('path');

var app = express();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    userName: String,
    email: String
});

var UserModel = mongoose.model('User', UserSchema);
var user = new UserModel({ userName: 'user', email: 'user@ship.com'});

var userDetails = user.userName + " " + user.email + " entered..";

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var db;

app.get('/', function(req, res){
    mongoose.connect("mongodb://localhost/testUser");
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function callback(){
      user.save(function(err, user){
        if(err) console.log('error in saving '+err);
        res.end(userDetails + "saved to mongodb.");
      });
    });
});

app.get('/users', function(req, res){
 if(db.readyState){
    UserModel.find(function(err,data){
            res.render('users', {list : data });
            db.close(function(err){
            if(!err) console.log('connection closed');
            });
        });
 }
 else
   res.send("connection closed. Go to root url..");
});

app.listen(3000);
console.log('Listening on port 3000');
