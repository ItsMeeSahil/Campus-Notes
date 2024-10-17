const express = require("express"); // Import Express framework
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const session = require('express-session'); // Import express-session for session management
const MongoStore = require('connect-mongo'); // Import connect-mongo to store session in MongoDB
const User = require("./models/userDb"); // Import User model for database interactions

const app = express(); // Initialize Express app
app.set("view engine", "ejs"); // Set EJS as the view engine for rendering views
app.use(express.static('public')); // Serve static files from the "public" directory

// Configure session middleware
app.use(session({
    secret: 'holabola', // Secret key for signing session ID
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something stored
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/Login-tut' }), // Store sessions in MongoDB
    cookie: { secure: false } // Set secure flag (false for development)
}));

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

// Render landing page
app.get("/", (req, res) => {
    res.render('landing'); 
});

// Render home page, checking for user session
app.get("/home", (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); // Redirect to sign-in/sign-up if no user session
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("index", { firstName, lastName, email }); // Render home page with user info
});

// Render sign-in/sign-up page
app.get("/signinSignup", (req, res) => {
    res.render("signinSignup"); // Render sign-in/sign-up view
});

// Handle user signup
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body; // Get user data from request body

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.render('userAlreadyExists'); // Render error view if user exists
        }

        const saltRounds = 10; // Number of rounds for salt
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password: hashedPassword // Store hashed password
        });

        await newUser.save(); // Save new user to the database
        // Store user info in session
        req.session.user = { firstName: name.split(' ')[0], lastName: name.split(' ')[1] || '', email }; 
        res.redirect('/home'); // Redirect to home page after successful signup
    } catch (err) {
        console.error("Error during registration:", err); // Log any error during registration
        res.render('error'); // Render error view
    }
});

// Handle user sign-in
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body; // Get user credentials from request body

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.render("userNotFound"); // Render error view if user not found
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("incorrect"); // Render error view if password does not match
        }

        // Store user info in session upon successful sign-in
        req.session.user = { firstName: user.name.split(' ')[0], lastName: user.name.split(' ')[1] || '', email };
        res.redirect('/home'); // Redirect to home page
    } 
    catch (err) {
        console.error("Error during login:", err); // Log any error during login
        res.render("error", 'something went wrong'); // Render error view
    }
});

// Handle user logout
app.post("/logout", (req, res) => {
    req.session.destroy(err => { // Destroy session
        if (err) {
            console.error("Error during logout:", err); // Log any error during logout
            return res.send("An error occurred while logging out. Please try again."); // Send error message
        }
        res.redirect('/signinSignup'); // Redirect to sign-in/sign-up page
    });
});

// Render error page
app.get('/error', (req, res) => {
    res.render('error'); // Render error view
});

// Routes for BCA program
app.get('/home/bca', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); // Redirect if no user session
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("BCA", { firstName, lastName, email }); // Render BCA page with user info
});

// Routes for semester pages under BCA program
app.get('/home/bca/sem1', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("sem1", { firstName, lastName, email }); // Render semester 1 page
});

// Similar routes for other semesters
app.get('/home/bca/sem2', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("sem2", { firstName, lastName, email }); // Render semester 2 page
});

// Additional semester routes can be added similarly
app.get('/home/bca/sem3', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("sem3", { firstName, lastName, email }); // Render semester 3 page
});
app.get('/home/bca/sem4', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("sem4", { firstName, lastName, email }); // Render semester 4 page
});
app.get('/home/bca/sem5', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("comingsoon"); // Render coming soon page for semester 5
});
app.get('/home/bca/sem6', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("comingsoon"); // Render coming soon page for semester 6
});

// Routes for study and coding playlists
app.get('/home/studyPlaylist', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("studyPlaylist", { firstName, lastName, email }); // Render study playlist page
});
app.get('/home/codingPlaylist', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    const { firstName, lastName, email } = req.session.user; // collect user info from session
    res.render("codingPlaylist", { firstName, lastName, email }); // Render coding playlist page
});

// Render coming soon page for various subjects
app.get('/comingsoon', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    res.render("comingsoon"); // Render coming soon page
});

// Routes for other courses
app.get('/home/cse', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    res.render("comingsoon"); // Render coming soon page for CSE
});
app.get('/home/bsc', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    res.render("comingsoon"); // Render coming soon page for BSc
});
app.get('/home/ee', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    res.render("comingsoon"); // Render coming soon page for Electrical Engineering
});
app.get('/home/bba', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    res.render("comingsoon"); // Render coming soon page for BBA
});
app.get('/home/me', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    res.render("comingsoon"); // Render coming soon page for Mechanical Engineering
});
app.get('/home/jmc', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    res.render("comingsoon"); // Render coming soon page for Journalism and Mass Communication
});
app.get('/home/civil', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/signinSignup'); 
    }
    res.render("comingsoon"); // Render coming soon page for Civil Engineering
});

// Start the server
const port = 3000; // Define the port number
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`); // Log the server status
});
