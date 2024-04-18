const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const usercontroller = require('./backend/controller/users')
const petsController = require('./backend/controller/petsController');
const adoptionController = require('./backend/controller/AdoptionForm')
const app = express();
const session  = require('express-session')
const crypto = require('crypto');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.use(session({
    secret: crypto.randomBytes(32).toString('hex'), // Secret key used to sign the session ID cookie
    resave: false,
    saveUninitialized: false
}));


const Authentication = async (request,response,next) => {       //Function responsible of checking if the user is logged in or not

    if(request.session.user_id){
        next()
    }

    else{
        response.redirect("/login")
    }
}


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

app.get("/userSettings", (req, res) => {
    res.render("userSettings.ejs", {title: 'User Settings'});
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

app.get("/fillForm/:user_id/:id", async (req,res) => {

    res.render("AdoptionForm.ejs", {title: "Pet Adoption Form"})


})

//Route responsible for the signup (The location of the route could be changed sometime in the future)
app.post('/signup', async (request,response) =>{

    response.json(await usercontroller.signup(request.body))

})
app.post('/login', async (request, response) =>{

    response.json(await usercontroller.login(request))

})

app.post('/petRegistration', petsController.petRegistration);

app.post('/postPetRegistration', petsController.petRegistration);


app.post('/verify', async (request, response) =>{
    response.json(await usercontroller.verifyVerificationCode(request.body))
})



app.post("/fillForm/:user_id/:id", async (req, res) =>{


    res.json(await adoptionController.FillForm(req.body,req.params))

})



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("port running;" + PORT));