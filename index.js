const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const usercontroller = require('./backend/controller/users')

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())



// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('Home', { title: 'Express with EJS' });
});

app.get("/login", (req, res) => {
    res.render("login.ejs", {title: 'Login'});
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs", {title: 'Signup'});
});

// Route Example (Temporary)
app.get('/example',async (request,response) => {

    response.json(await usercontroller.getAllUsers())
})

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("port running;" + PORT));