const express = require('express');
const router = express.Router();
const validator = require('validator');
const zxcvbn = require('zxcvbn');


// Password and Email routes
router.post('/validate-password', (req, res) => {
    const password = req.body.password;
    const passwordStrength = zxcvbn(password).score;
    if (passwordStrength >= 2) {
        res.status(200).send('Password meets minimum strength requirements');
    } else {
        res.status(400).send('Password does not meet minimum strength requirements');
    }
});

router.post('/verify-email', (req, res) => {
    const email = req.body.email;
    if (validator.isEmail(email)) {
        // Send verification email logic here
    } else {
        res.status(400).send('Invalid email address');
    }
});


// Export the router
module.exports = router;