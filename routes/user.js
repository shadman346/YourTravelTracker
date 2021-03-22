const express = require('express');
const router = express.Router();
const catchAsynch = require('../utils/catchAsync');
const {RegisterPage, RegisterUser, LoginPage, LoginUser, Logout} = require('../controller/user')

router.get('/register',catchAsynch(RegisterPage))

router.post('/register',catchAsynch(RegisterUser));

router.get('/login',catchAsynch(LoginPage));

router.post('/login',catchAsynch(LoginUser));

router.get('/logout',catchAsynch(Logout));


module.exports = router;