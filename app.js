//jshint esversion:6
require('dotenv').config(); // level 3 encryption
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require("mongoose-encryption"); // level 2 encryption
// const md5 = require("md5"); // level 4 encryption using hashing
const bcrypt = require("bcrypt"); // level 5 encryption using salting and hashing
const saltRounds = 10; // level 5 encryption using salting and hashing
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect to MongoDB

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Create a user schema

const userSchema =new mongoose.Schema({
    email: String,
    password: String
});

 // level 2 encryption
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); // level 2 encryption
// Create a user model

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
        email: req.body.username,
        password: hash
    });
    try{
        newUser.save();
        res.render("secrets");
    }catch(err){
        console.log(err);
    }
});
});
// level 1 encryption: preety bad as the data is in plain text in database
app.post("/login", function(req,res){
    const username = req.body.username;
    // const password = md5(req.body.password);
    const password = req.body.password;
    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                // if(foundUser.password === password){
                //     res.render("secrets");
                // }
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets");
                    }
                }
                );
            }
        }
    });
});

// level 2 database encryption: mongoose-encryption


app.listen(3000, function() {
    console.log("Server started on port 3000");
});