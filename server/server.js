require('dotenv').config({path: './server/.env'});
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// import routes from routes folder 
const validationPwd = require('./src/routes/validationPwd/credentials');
const security = require('./src/routes/security/security');
const authentication = require('./src/routes/authentication/authentication');


// Set up middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.json());

// Set up routes
app.use('/', validationPwd);
app.use('/', security);
app.use('/api/auth', authentication);


// set up the port
const PORT = process.env.PORT || 3000;

//conect to mongodb
 mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));




