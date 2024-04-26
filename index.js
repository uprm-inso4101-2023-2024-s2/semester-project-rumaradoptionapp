const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const usercontroller = require('./backend/controller/users')
const petsController = require('./backend/controller/petsController');
const petImageController = require('./backend/controller/petimageController');
const adoptionController = require('./backend/controller/AdoptionForm')
const app = express();
const session  = require('express-session')
const crypto = require('crypto');
const multer = require('multer');
const { profile } = require('console');
const upload = multer({ dest: 'imageProfileUploads/' });
const { generateTemporaryPassword } = require('./backend/dao/users');
const dao = require('./backend/dao/users');
app.use(express.static('public'));
const { supabase } = require('./backend/config/config');
const petImageDao = require('./backend/dao/Petimage');





// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.use(session({
    secret: crypto.randomBytes(32).toString('hex'), // Secret key used to sign the session ID cookie
    resave: false,
    saveUninitialized: false
}));


const Authentication = async (request, response, next) => {
  if (request.session.user_id) {
    next();
  } else {
    response.redirect("/login");
  }
};

const facultyAuthentication = async (request, response, next) => {
  if (request.session.user_id && request.session.faculty) { // Check if user is logged in and is a faculty member
    next(); // User is authenticated, proceed to next middleware
  } else {
    response.redirect("/"); // Redirect to home page if user is not authenticated or not a faculty member
  }
};

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res) => {
  if (req.session.user_id) {
    profilePicture = await usercontroller.getProfilePicture(req);
    res.render('Home', { title: 'Express with EJS', LoggedIn: req.session.user_id, isFoster: req.session.foster, isAdmin: req.session.faculty, profilePicture,Letter: req.session.usernameFirstLetter });
  } else {
    res.render('Home', { title: 'Express with EJS', LoggedIn: req.session.user_id, isFoster: req.session.foster, isAdmin: req.session.faculty, profilePicture: "null",Letter: "null" });
  }
});

app.get('/example', async (request, response) => {
  response.json(await usercontroller.getAllUsers());
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs", { title: 'Signup' });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { title: 'Login' });
});

app.get("/userSettings", (req, res) => {
  res.render("userSettings.ejs", { title: 'User Settings' });
});

app.get("/faculty", async (req, res) => {
  const facultyMembers = await usercontroller.getFaculty();
  res.render("Faculty.ejs", { facultyMembers });
});

app.get("/admin", async (req, res) => {
    const people = await usercontroller.getUsers();
    res.render("Admin.ejs", { people });
})

app.get("/verify", (req, res) => {
  res.render("verificationCode.ejs", { title: 'Verify' });
});

app.get("/forgotPassword", (req, res) => {
  res.render("forgotPassword.ejs", { title: 'Forgot Password' });
});

app.get("/verifyTemporaryPassword", (req, res) => {
  res.render("verifyTemporaryPassword.ejs", { title: 'Verify Temporary Password' });
});

app.get("/resetPassword", (req, res) => {
  res.render("resetPassword.ejs", { title: 'Reset Password' });
});

app.get("/petRegistration", facultyAuthentication, (req, res) => {
  res.render("petRegistration.ejs", { title: 'Pet Registration' });
});

app.get("/postPetRegistration", (req, res) => {
  res.render("postPetRegistration.ejs", { title: 'Post Pet Registration' });
});


app.get('/petListings', petsController.getAllPets);

app.get('/petProfile/:id', petsController.getPetById);

app.get("/foster", async (req, res) => {
  const fosterMembers = await usercontroller.getFoster();
  res.render("Foster.ejs", { fosterMembers });
});

app.get("/fillForm",Authentication, async (req, res) => {
  res.render("AdoptionForm.ejs", { title: "Pet Adoption Form" });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        res.redirect('/');
      }
    });
  });
  

app.post('/signup', async (request, response) => {
  response.json(await usercontroller.signup(request.body));
});

app.post('/login', async (request, response) => {
  response.json(await usercontroller.login(request));
});

app.post("/updateFacultyStatus", async (req, res) => {
    res.json(await usercontroller.updateFaculty(req.body));
})

app.post('/petRegistration', petsController.petRegistration);

app.post('/postPetRegistration', petsController.petRegistration);

app.post('/verify', async (request, response) => {
  response.json(await usercontroller.verifyVerificationCode(request.body));
});

app.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await dao.checkEmail(req.body);
    if (userExists) {
      const temporaryPassword = await generateTemporaryPassword(email);
      await usercontroller.sendTemporaryPasswordEmail(email, temporaryPassword);
      res.json("Email sent successfully");
    }
  } catch (error) {
    console.error('Error initiating password reset:', error);
  }
});

app.post("/verifyTemporaryPassword", async (req, res) => {
  try {
    const { email, temporary_password } = req.body;
    const isTemporaryPasswordValid = await usercontroller.verifyTemporaryPassword(email, temporary_password);
    if (isTemporaryPasswordValid) {
      res.json("Verification successful");
    } else {
      res.status(400).json('Invalid temporary password. Please try again.');
    }
  } catch (error) {
    console.error('Error verifying temporary password:', error);
  }
});

app.post("/resetPassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const result = await usercontroller.resetPassword(email, newPassword);
    if (result === "Reset Password Success") {
      res.json("Reset Password Success");
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error resetting password:', error);
  }
});

app.post("/fillForm", async (req, res) => {
  res.json(await adoptionController.FillForm(req));
  
});

app.post("/change-profile-pic", upload.single('profile_picture'), async (req, res) => {
  await usercontroller.setprofilepicture(req);
  res.redirect("/");
});

// Route to add a pet image
app.post('/addPetImage/:pet_id', upload.single('image'), async (req, res) => {
  try {
    const { file } = req;
    const { pet_id } = req.params;
    // Upload file to Supabase Storage and retrieve URL
    const { publicURL, error: uploadError } = await supabase.storage.from('pet-images').upload(`images/${file.filename}`, file.stream);
    if (uploadError) throw uploadError;
    // Store the image URL in the database
    const result = await petImageDao.addPetImage(pet_id, publicURL);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("port running;" + PORT));