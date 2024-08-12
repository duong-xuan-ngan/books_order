const express = require("express");
const { OAuth2Client } = require('google-auth-library');
const collection = require("./config");

const app = express();
const client = new OAuth2Client("608768387652-hjd706rlun6gjk006j50j94u1nnvc75s.apps.googleusercontent.com");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

// Google OAuth 2.0 handler
app.post('/auth/google', async (req, res) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: "608768387652-hjd706rlun6gjk006j50j94u1nnvc75s.apps.googleusercontent.com",
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        // Ensure the email has the correct domain
        const domain = email.substring(email.lastIndexOf("@") + 1);
        if (domain !== "student.vgu.edu.vn") {
            return res.status(400).json({ success: false, message: "You must use a @student.vgu.edu.vn email address." });
        }

        // Check if the user already exists in the database
        let user = await collection.findOne({ email });

        if (!user) {
            // If not, create a new user
            user = await collection.insertOne({ email, name: payload.name });
        }

        res.json({ success: true, message: "User authenticated successfully." });

    } catch (error) {
        console.error("Error verifying Google token:", error);
        res.status(500).json({ success: false, message: "Authentication failed." });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});