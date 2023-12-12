import UserModel from '../models/user.schema.js';
import StudentModel from '../models/student.schema.js';

export default class UserController {

    // Render the registration page
    async getRegistrationPage(req, res) {
        res.render("registration", { userEmail: req.session.userEmail, userName: req.session.userName, errorMessage: null });
    }

    // Render the login page
    async getLoginPage(req, res) {
        res.render("login", { userEmail: req.session.userEmail, userName: req.session.userName, errorMessage: null });
    }

    // Render the index view
    async getIndexView(req, res) {
        res.render("index", { userEmail: req.session.userEmail, userName: req.session.userName, errorMessage: null });
    }

    // Handle user registration
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;

            // Check if the email is already registered
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.render('registration', { errorMessage: 'Email already in use' });
            }

            // Create a new user
            const newUser = new UserModel({ name, email, password });
            await newUser.save();

            // Redirect to the login page after successful registration
            res.render("login", { errorMessage: null });
        } catch (error) {
            console.error(error);
            return res.render('login', { errorMessage: 'Internal Server Error' });
        }
    }

    // Handle user login
    async signin(req, res) {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.render('login', { errorMessage: 'Invalid email or password' });
            }

            // Compare the provided password with the stored hash
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.render('login', { errorMessage: 'Invalid email or password' });
            }

            // Add user information to session
            req.session.userEmail = user.email;
            req.session.userName = user.name;

            // Pass user information to the views
            const students = await StudentModel.find().populate('interviews');
            return res.render("student", { students, userEmail: req.session.userEmail, userName: req.session.userName, errorMessage: '' });
        } catch (error) {
            console.error(error);
            return res.render('login', { errorMessage: 'An unexpected error occurred' });
        }
    }

    // Handle user logout
    async logout(req, res) {
        try {
            // Destroy the session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.render('login', { errorMessage: 'Internal Server Error' });
                } else {
                    // Redirect to the login page or any other desired route after logout
                    res.redirect('/');
                }
            });
        } catch (error) {
            console.error(error);
            return res.render('login', { errorMessage: 'Internal Server Error' });
        }
    }

}
