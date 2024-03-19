const { response } = require('express');
const randomToken = require('random-token');
const nodemailer = require('nodemailer');
const argon2 = require('argon2');
const db = require('../config/pg_config');

// Function to generate a random verification code
const generateVerificationCode = () => {
    return randomToken(6, '0123456789');
};

// Function to send an email with the verification code
const sendVerificationEmail = async (email, verificationCode) => {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com', // Enter your email address
            pass: 'your_email_password' // Enter your email password
        }
    });

    // Email content
    const mailOptions = {
        from: 'your_email@gmail.com', // Enter your email address
        to: email,
        subject: 'Verification Code for Login',
        text: `Your verification code is: ${verificationCode}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

// Query responsible for adding new users to the database (including sending verification code)
const addNewUser = async (request, response) => {
    const { firstname, lastname, username, email, location, gender, foster, password } = request.body;

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Insert user data into the database
    const result = await db.pool.query('INSERT INTO users (firstname, lastname, username, email, password, location, gender, foster, verification_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id', [firstname, lastname, username, email, hashedPassword, location, gender, foster, verificationCode]);

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return result.rows[0];
};

// Function to verify the entered verification code during login
const verifyVerificationCode = async (username, enteredVerificationCode) => {
    const result = await db.pool.query('SELECT verification_code FROM users WHERE username = $1', [username]);
    const storedVerificationCode = result.rows[0].verification_code;
    return enteredVerificationCode === storedVerificationCode;
};

module.exports = {
    addNewUser,
    verifyVerificationCode
};
