const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const usercontroller = require('./backend/controller/users')
const petcontroller = require('./backend/controller/pets');

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

// Route Example (Temporary)
app.get('/example',async (request,response) => {

    response.json(await usercontroller.getAllUsers())
})

app.get('/pets', async (req, res) => {
    try {
        const pets = await petsController.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs", {title: 'Signup'});
});

app.get("/login", (req, res) => {
    res.render("login.ejs", {title: 'Login'});
});

//Route responsible for the signup (The location of the route could be changed sometime in the future)
app.post('/signup', async (request,response) =>{

    response.json(await usercontroller.signup(request.body))

})

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("port running;" + PORT));