const Razorpay = require("razorpay")
require('dotenv');

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
    currency: "INR"  // currency of payment (default INR)
 });
 