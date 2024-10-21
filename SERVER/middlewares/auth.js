// we have to write four middleware 
const jwt = require("jsonwebtoken");
require("dotenv").config()
const user = require("../models/User")


// auth
exports.auth = async (req, res, next) => {
    try{
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");

        // if token missing, return respond
        if(!token){
            return res.status(401).json({
                success:false,
                message: "token not found!!"
            });
        }
        // console.log("token found", token);

        // verify the token 
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("decoded data: ", decode);
            req.user = decode;
        } 
        catch(error){
            return res.status(400).json({
                success:false,
                message: "token is invalid"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "Something went wrong while verifying the token"
        });
    }
}


// isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType != "Student"){
            return res.status(401).json({
                success:true,
                message: "this is a protected route for student only!!"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "user role can't be verified"
        });
    }
}


// isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType != "Instructor"){
            return res.status(401).json({
                success:true,
                message: "this is a protected route for instructor only!!"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "user role can't be verified"
        });
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType != "Admin"){
            return res.status(401).json({
                success:true,
                message: "this is a protected route for Admin only!!"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: "user role can't be verified"
        });
    }
}