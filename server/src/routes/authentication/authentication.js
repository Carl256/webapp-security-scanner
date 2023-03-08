const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check } = require('express-validator');

// Import the User model
const User = require('../../models/users');

// import the controllers
const  registerController  = require('../../controllers/authController');
const { register, logIn, logOut, changePassword, resetPassword } = registerController;


// POST /api/auth/register - Register a new user
router.post('/register', [ check('email', "Email is required").notEmpty(), check('password', "Password is required").notEmpty() ], register);

// POST /api/auth/login - Authenticate and log in a user
router.post('/login', [ check('email', "Email is required").notEmpty(), check('password', "Password is required").notEmpty() ], logIn);

// POST /api/auth/logout - Log out a user
router.post('/logout', /*authenticateToken,*/ logOut);

// PUT /api/auth/change-password - Change a user's password
router.put('/change-password', passport.authenticate('jwt', { session: false }), changePassword);

// POST /api/auth/reset-password - Reset a user's password
router.post('/reset-password', resetPassword);


// Export the authentication router
module.exports = router;