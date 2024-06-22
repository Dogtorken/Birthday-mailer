const cron = require('node-cron');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

// Cron job to run every day at 7am
cron.schedule('0 7 * * *', async () => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const users = await User.find({
        dob: { $gte: new Date(todayStr), $lt: new Date(todayStr + 'T23:59:59') }
    });

    users.forEach(user => {
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Happy Birthday!',
        text: `Dear ${user.username},\n\nWishing you a very Happy Birthday!\n\nBest regards,\nKenward Terhemba`
        };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
        });
    });
});

console.log('Cron job scheduled');
