const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");


const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// send OTP function
function generateOtp(){
    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    return otp;
}
exports.sendotp = async (req, res) => {
    try{
        // fetch email from req body
        const {email} = req.body;
    
        // check if user already exist
        const checkUserPresent = await User.findOne({email});
    
        // if user is already present in the db
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered, please log in"
            });
        }
        // genarate otp
        var otp = generateOtp();
        console.log("otp generated: ", otp);
        let prevOTP = await OTP.findOne({otp:otp});
        while(prevOTP && prevOTP.otp==otp){
            otp = generateOtp();
            prevOTP = await OTP.findOne({otp:otp});
        }

        const otpPayload = await OTP.create({
            email,
            otp,
        });
        console.log(otpPayload);

        res.status(200).json({
            success:true,
            message:"OTP Sent Successfully!!",
            otp,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"SomeThing Went Wrong!!"
        })
    }
}

// signup 
exports.signup = async (req, res) => {
    try{

        // data fetch from req body\
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType, 
            otp
        } = req.body;

        // validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"Fill all the details carefully!!"
            })
        }
        
        // match pass and confirm pass
        if(password !== confirmPassword){
            return res.status.json({
                success:false,
                message:"passWord doesn't match width confirm password!!"
            })
        }
    
        // check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: "user is already regsitered!!"
            })
        }
    
        // find most recent otp for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp[0].otp);
        console.log("otp in req body", otp);
    
        // validate otp
        if(recentOtp.length == 0){
            return res.status(400).json({
                success:false,
                message: "Otp not found!!"
            })
        }
    
        if(otp !=  recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message: "wrong OTP!!"
            })
        }
    
        // hash pass with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log("hashed password: ", hashedPassword);
    
        // create entry in db
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        console.log("profile details: ", profileDetails);
    
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType: accountType, 
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/9.x/initials/svg?seed=${firstName}%20${lastName}`,      
        });

        console.log(user);
        // return successful response
        return res.status(200).json({
            user,
            success: true,
            message: "User is regsisterd successfully!!"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "User could not be regsitered, Please try again!!"
        });
    }

}

// login 

exports.login = async (req, res) => {
    try{
        // get data from req body
        const {email, password} = req.body;

        // validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message: "fill all the details carefully!!"
            });
        }

        // check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails").exec();
        if(!user){
            return res.status(401).json({
                success:false,
                message: "User is not regsitered, please signup first"
            });
        }
        
        // check the password is correct or not
        // generate jwt token
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;


            // create cookie 
            // send successful response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message: "Login successfully!!"
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message: "password is incorrect!!"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Couldn't login, please try again!!"
        })
    }
}

// change password
exports.changePassword = async (req, res) => {
    // get data (oldPasword,new password confirm password) from req body
    const {oldPasword, newPasword, confirmPassword, token} = req.body;
    // validate data
    if(!oldPasword ||!newPasword ||!confirmPassword){
        return res.status(403).json({
            success:false,
            message: "Fill all the details carefully!!"
        });
    }
    // check if new password and old confirm password matches or not
    if(newPasword !== confirmPassword){
        return res.status(400).json({
            success:false,
            message: "new password doesn't match with confirm password!!"
        });
    }
    // fetch user from db using token
    const user = await User.findOne({token})
    if(!user){
        return res.status(401).json({
            success:false,
            message: "Unauthorized access!!"
        });
    }
    // check if old password is correct or not
    const isOldPasswordCorrect = await bcrypt.compare(oldPasword, user.password);
    if(!isOldPasswordCorrect){
        return res.status(401).json({
            success:false,
            message: "old password is incorrect!!"
        });
    }
    // hash new password with bcrypt
    const hashedPassword = await bcrypt.hash(newPasword, 10);
    user.password = hashedPassword;
    await user.save();
    
    // send mail to the user
    try{
        const mailResponse = await mailSender(user.email, "Reset Password Notification | Study Notion",
             `Dear ${user.firstName} ${user.lastName} </br>
             your password has been reset successfully </br>
             If you didn't request this change, please contact our support team at 1234567890.
             Thank you for using Study Notion.
             `);
        console.log("Email sent successfully: ", mailResponse);
    }
    catch(error){
        console.log("Error occured while sending mail: ", error);
        throw error;
    }
    // send successful response
    return res.status(200).json({
        success: true,
        message: "Password updated successfully!!"
    });
}
 
