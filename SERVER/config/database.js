const mongoose = require("mongoose");
require("dotenv").config();
exports.DBconnect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(console.log("mongoose DB connected successfully!!"))
    .catch((error) => {
        console.log("mongoose DB connection failed!!");
        console.error(error);
        process.exit(1);
    });
}