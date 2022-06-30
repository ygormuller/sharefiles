require('dotenv').config();
const express = require('express');
const UserController = require('./src/controllers/UserController');
const mongoose = require('mongoose');

const app = express();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

console.log(dbUser);
console.log(dbPassword);

app.use('/', UserController);

mongoose.
connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.3f7c3.mongodb.net/?retryWrites=true&w=majority`
    )
.then(()=>{
    app.listen(3000);
    console.log('Conectou ao banco!');
})
.catch((err)=>console.log(err));
