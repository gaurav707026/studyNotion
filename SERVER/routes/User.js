const express = require('express');
const router = express.Router();

const {
    login, 
    signup,
    sendotp,
    changePassword
} = require("../controllers/Auth");
const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth");

// authentication route----------------------------------------------------------------

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.put("/changepassword", auth, changePassword);

// password reset route---------------------------------------------------------------

router.post("/reset-password-token", resetPasswordToken);
router.put("/reset-password/:id", resetPassword);

module.exports = router;