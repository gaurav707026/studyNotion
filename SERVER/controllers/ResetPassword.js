const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require('../mail/templates/passwordUpdate');
const bcrypt = require('bcrypt');


// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try{
        // get email from body
        const email = req.body.email;
    
        // check user for this email, email validation
        const user = await User.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message: "your email is not registered with us!!"
            })
        }
    
        // generate token 
        const token = crypto.randomUUID();
    
        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires: Date.now() + (5*60*1000)
            },
            {new: true}
        );
    
        // create password reset url
        const url = `http://localhost:3000/update-password/${token}`
    
        // send mail
        await mailSender(email, "Password reset link | StudyNotion", `password reset link: ${url}`);
    
        // return response
        return res.json({
            success:true,
            message: "Reset password email sent successfully!!"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Something went wrong while sending reset password email!!"
        });
    }

}


// resetPassword
exports.resetPassword = async (req, res) => {
    try{
        // fetch data from req body
        const {password, confirmPassword, token} = req.body;
    
        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message: "password does not match"
            });
        }
        // get userdetails
        const userDetails = await User.findOne({token:token});
        console.log("userDetails", userDetails);
    
        // if no entry -- invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message: "invalid token!!"
            })
        }
    
        // check token expires time 
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message: "token is expires, please re-generate the password again"
            })
        }
        // hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // update hashed password in db
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        );
        // send email to the user
        await mailSender(userDetails.email, "Study Notion | Password Update Successful",
            passwordUpdated(userDetails.email, userDetails.firstName + " " + userDetails.lastName));
    
        // sent a successful response
        return res.status(200).json({
            success:true,
            message: "Password reset successful"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: "Something went wrong while reset password"
        });
    }
}
