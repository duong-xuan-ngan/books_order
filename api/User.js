const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require("axios");

// MongoDB user model
const User = require("./../models/user");
// MongoDB user verification model
const UserVerification = require("./../models/UserVerification");
// MongoDb passwordReset
const PasswordReset = require("./../models/PasswordReset");

const Book = require("./../models/Books");

const verifyToken = require("./verifyToken");
// authentication for user
const authRouter = require("./for_user");
// Email handler
const nodemailer = require("nodemailer");

// Author
const authorRoute = require("./Authors");
// Book
const productRouter = require("./books");
// Customer
const customerRouter = require("./customer");
// Orders




// Unique string generator
const { v4: uuidv4 } = require("uuid");

// Environment variables
require("dotenv").config();

// Password handler
const bcryptjs= require("bcryptjs");

// Path for static verified name
const path = require("path");

// Nodemailer transporter setup
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

// Testing transporter success
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready for messages");
        console.log(success);
    }
});

router.get("/email_verification", (req, res) => {
    const email = req.query.email;
    res.render("email_verification", { email: email });
})


// Route to display the BookStore page
router.get("/BookStore", async (req, res) => {
    try {
        const sortOrder = req.query.sort || 'default';
        let sortQuery = {};

        switch (sortOrder) {
            case 'priceDesc':
                sortQuery = { price: -1 };
                break;
            case 'priceAsc':
                sortQuery = { price: 1 };
                break;
            default:
                sortQuery = {};
        }

        const books = await Book.find().sort(sortQuery);
        res.render("BookStore", { books, currentSort: sortOrder });
    } catch (err) {
        console.error("Error fetching books:", err);
        res.render("BookStore", { books: [], error: "Failed to fetch books. Please try again later." });
    }
});

router.get('/books/:id', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).send('Book not found');
      }
      res.render('BookDetails', { book });
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
// Route to display signup page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Route to display signin page
router.get("/signin", (req, res) => {
    res.render("signin", { error: null }); // Pass the error variable to the view
});

// Route to display forgot password page
router.get("/forgotpass", (req, res) => {
    res.render("forgotpass");
});

router.get("/resetpassword", (req,res) => {
    res.render("/resetpassword");
})

// Route to display landingPage
router.get("/landingPage", (req, res) => {
    res.render("landingPage");
});

router.get("/mainpage", (req, res) => {
    res.render("mainpage");
})

router.get("/user", (req,res) => {
    res.render("landingpage");
})

router.get("/purchase", (req, res) => {
    res.render("purchase");
})


// Signup
router.post("/signup", (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (name === "" || email === "" || password === "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!",
        });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered",
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered",
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!",
        });
    } else {
        User.find({ email })
            .then((result) => {
                if (result.length) {
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists",
                    });
                } else {
                    // Try to create new user
                    const saltRounds = 10;
                    bcryptjs.hash(password, saltRounds).then((hashedPassword) => {
                        const newUser = new User({
                            name,
                            email,
                            password: hashedPassword,
                            verified: false,
                            resetPasswordToken: null,
                            resetPasswordExpires: null,
                        });

                        newUser
                            .save()
                            .then((result) => {
                                sendVerificationEmail({ _id: result._id, email: result.email }, res);
                            })
                            .catch((err) => {
                                console.error("Error saving user:", err);
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred while saving user account password!",
                                });
                            });
                    }).catch((err) => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while hashing password!",
                        });
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user!",
                });
            });
    }
});

// Send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
    const currentUrl = "http://localhost:5000/";
    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link 
        <b>expires in 1 hours</b>.</p><p>Press <a href=${currentUrl + "user/verified_signup/" + _id + "/" + uniqueString}>here</a>
         to proceed.</p>`,
    };

    const saltRounds = 10;
    bcryptjs.hash(uniqueString, saltRounds)
        .then((hashedUniqueString) => {
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000,
            });
            newVerification
                .save()
                .then(() => {
                    transporter
                        .sendMail(mailOptions)
                        .then(() => {
                            res.json({
                                status: "PENDING",
                                message: "Verification email sent",
                            });
                        })
                        .catch((error) => {
                            console.log("Transporter error:", error);
                            res.json({
                                status: "FAILED",
                                message: "Verification email failed",
                            });
                        });
                })
                .catch((error) => {
                    console.log("Save verification error:", error);
                    res.json({
                        status: "FAILED",
                        message: "Couldn't save verification email data",
                    });
                });
        })
        .catch((error) => {
            console.log("Hashing error:", error);
            res.json({
                status: "FAILED",
                message: "An error occurred while hashing email data!",
            });
        });
};

const sendPasswordResetEmail = async (user, resetToken) => {
    const uniqueString = uuidv4() + user._id;
    const resetUrl = `http://localhost:5000/user/resetpassword/${resetToken}`;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: user.email,
        subject: "Password Reset Request",
        html: `
            <p>You requested a password reset for your account.</p>
            <p>Please click on the following link to proceed with the password reset:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    };

    const saltRounds = 10;
    try {
        const hashedUniqueString = await bcryptjs.hash(uniqueString, saltRounds);
        const newPasswordReset = new PasswordReset({
            userId: user._id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000, // 1 hour expiration
        });

        await newPasswordReset.save();
        await transporter.sendMail(mailOptions);

        return {
            status: "SUCCESS",
            message: "Password reset email sent.",
        };
    } catch (error) {
        console.error("Password reset error:", error);
        return {
            status: "FAILED",
            message: "Password reset email failed to send.",
        };
    }
};
// Verify email
router.get("/verified_signup/:userId/:uniqueString", (req, res) => {
    let { userId, uniqueString } = req.params;

    UserVerification.find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;

                if (expiresAt < Date.now()) {
                    UserVerification
                        .deleteOne({ userId })
                        .then(() => {
                            User.deleteOne({ _id: userId })
                                .then(() => {
                                    let message = "Link has expired. Please sign up again";
                                    res.redirect(`/user/verified_signup/error=true&message=${message}`);
                                })
                                .catch((error) => {
                                    let message = "Clearing user with expired unique string failed";
                                    res.redirect(`/user/verified_signup/error=true&message=${message}`);
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            let message = "An error occurred while clearing expired user verification record";
                            res.redirect(`/user/verified_signup/error=true&message=${message}`);
                        });
                } else {
                    bcryptjs
                        .compare(uniqueString, hashedUniqueString)
                        .then((result) => {
                            if (result) {
                                User.updateOne({ _id: userId }, { verified: true })
                                    .then(() => {
                                        UserVerification.deleteOne({ userId })
                                            .then(() => {
                                                res.sendFile(path.join(__dirname, "./../views/verified_signup.html"));
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                let message = "An error occurred while finalizing successful verification";
                                                res.redirect(`/user/verified_signup/error=true&message=${message}`);
                                            });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        let message = "An error occurred while updating user record";
                                        res.redirect(`/user/verified_signup/error=true&message=${message}`);
                                    });
                            } else {
                                let message = "Invalid verification details passed. Check your inbox";
                                res.redirect(`/user/verified_signup/error=true&message=${message}`);
                            }
                        })
                        .catch((error) => {
                            let message = "An error occurred while comparing unique strings.";
                            res.redirect(`/user/verified_signup/error=true&message=${message}`);
                        });
                }
            } else {
                let message = "Account record doesn't exist or has been verified already. Please sign up or log in.";
                res.redirect(`/user/verified_signup/error=true&message=${message}`);
            }
        })
        .catch((error) => {
            console.log(error);
            let message = "An error occurred while checking for existing user verification record";
            res.redirect(`/user/verified_signup/error=true&message=${message}`);
        });
});

// Verified page route
router.get("/verified_signup", (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified_signup.html"));
});


// Signin
router.post("/signin", (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email === "" || password === "") {
        res.render("signin", { error: { type: "empty_credentials" } });
    } else {
        User.findOne({ email })
            .then((user) => {
                if (!user) {
                    res.render("signin", { error: { type: "email_not_found" } });
                } else if (!user.verified) {
                    res.render("signin", { error: { type: "email_not_verified" } });
                } else {
                    bcryptjs.compare(password, user.password)
                        .then((isMatch) => {
                            if (isMatch) {
                                const accesstoken = jwt.sign({
                                    id: user._id,
                                    isAdmin: user.isAdmin,
                                }, 
                                process.env.JWT_SECRET,
                                { expiresIn: '1h' });
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signin successful",
                                    accesstoken,
                                });
                            } else {
                                res.render("signin", { error: { type: "invalid_credentials" } });
                            }
                        })
                        .catch((err) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while comparing passwords",
                            });
                        });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user",
                });
            });
    }
});

// Reset Password Page
router.get("/resetpassword/:token", (req, res) => {
    const { token } = req.params;

    User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    })
        .then((user) => {
            if (!user) {
                return res.render("error", {
                    message: "Password reset token is invalid or has expired.",
                });
            }
            res.render("resetpassword", { token });
        })
        .catch((err) => {
            res.render("error", {
                message: "An error occurred.",
            });
        });
});
// Forgot Password
router.post("/forgotpass", async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                status: "FAILED",
                message: "No account with that email address exists.",
            });
        }

        // Generate password reset token
        const resetToken = uuidv4();
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Update the user with reset token and expiry
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;

        await user.save();

        // Send password reset email
        const emailResponse = await sendPasswordResetEmail(user, resetToken);

        // Redirect to the email verification page (GET request)
        if (emailResponse.status === "SUCCESS") {
            res.redirect("/user/email_verification?email=" + encodeURIComponent(user.email));
        } else {
            res.json({
                status: "FAILED",
                message: "Failed to send password reset email.",
            });
        }
    } catch (err) {
        console.error("Error in forgotpass route:", err);
        res.json({
            status: "FAILED",
            message: "An error occurred during the password reset process.",
        });
    }
});



router.post("/resetpassword", (req, res) => {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.json({
            status: "FAILED",
            message: "Passwords do not match.",
        });
    }

    User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    })
        .then((user) => {
            if (!user) {
                return res.json({
                    status: "FAILED",
                    message: "Password reset token is invalid or has expired.",
                });
            }

            // Hash the new password
            bcryptjs.hash(password, 10)
                .then((hashedPassword) => {
                    user.password = hashedPassword;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save()
                        .then(() => {
                            res.redirect("/user/landingPage");
                        })
                        .catch((err) => {
                            console.error("Error saving new password:", err);
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while saving the new password.",
                            });
                        });
                })
                .catch((err) => {
                    console.error("Error hashing new password:", err);
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while hashing the new password.",
                    });
                });
        })
        .catch((err) => {
            console.error("Error finding user:", err);
            res.json({
                status: "FAILED",
                message: "An error occurred while finding the user.",
            });
        });
});

// Reset Password
router.post("/reset/:token", (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render("error", {
            message: "Passwords do not match.",
        });
    }

    User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    })
        .then((user) => {
            if (!user) {
                return res.render("error", {
                    message: "Password reset token is invalid or has expired.",
                });
            }

            // Hash the new password
            bcryptjs.hash(password, 10)
                .then((hashedPassword) => {
                    user.password = hashedPassword;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save()
                        .then(() => {
                            res.render("success", {
                                message: "Password has been reset successfully. You can now login with your new password.",
                            });
                        })
                        .catch((err) => {
                            res.render("error", {
                                message: "An error occurred while saving the new password.",
                            });
                        });
                })
                .catch((err) => {
                    res.render("error", {
                        message: "An error occurred while hashing the new password.",
                    });
                });
        })
        .catch((err) => {
            res.render("error", {
                message: "An error occurred while finding the user.",
            });
        });
});

router.use("/authors", authorRoute);
router.use("/books", productRouter);

router.use("/customers", customerRouter);
// router.use("/author", authorRouter);
module.exports = router;