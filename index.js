const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const usercontroller = require('./backend/controller/users')
const petsController = require('./backend/controller/petsController');
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

app.get("/signup", (req, res) => {
    res.render("signup.ejs", {title: 'Signup'});
});

app.get("/login", (req, res) => {
    res.render("login.ejs", {title: 'Login'});
});

app.get("/faculty", async (req, res) => {
    const facultyMembers = await usercontroller.getFaculty();
    res.render("Faculty.ejs", { facultyMembers });
})

app.get("/verify", (req, res) => {
    res.render("verificationCode.ejs", {title: 'Verify'});
});

app.get("/petRegistration", (req, res) => {
    res.render("petRegistration.ejs", {title: 'Pet Registration'});
});

app.get("/postPetRegistration", (req, res) => {
    res.render("postPetRegistration.ejs", {title: 'Post Pet Registration'});
});

app.get('/petListings', (req, res) => {
    res.render("petListings.ejs", {title: 'Pet Listings'});
});

app.get("/foster", async (req, res) => {
    const fosterMembers = await usercontroller.getFoster();
    res.render("Foster.ejs", { fosterMembers });
})

//Route responsible for the signup (The location of the route could be changed sometime in the future)
app.post('/signup', async (request,response) =>{

    response.json(await usercontroller.signup(request.body))

})
app.post('/login', async (request, response) =>{

    response.json(await usercontroller.login(request.body))

})

app.post('/petRegistration', petsController.petRegistration);

app.post('/postPetRegistration', petsController.petRegistration);


app.post('/verify', async (request, response) =>{
    response.json(await usercontroller.verifyVerificationCode(request.body))
})

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("port running;" + PORT));