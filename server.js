const app = require('./src/app');
const mongoose = require('mongoose');
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.
connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.3f7c3.mongodb.net/?retryWrites=true&w=majority`
    )
.then(()=>{
    app.listen(3000);
    console.log('Conectou ao banco!');
})
.catch((err)=>console.log(err));
