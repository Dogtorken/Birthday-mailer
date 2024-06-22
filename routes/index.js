const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET form page
router.get('/', (req, res) => {
    res.render('form');
    });

    // POST form data
    router.post('/add-user', async (req, res) => {
    const { username, email, dob } = req.body;
    const newUser = new User({
        username,
        email,
        dob: new Date(dob)
    });

    await newUser.save();
    res.redirect('/');
    });

module.exports = router;
