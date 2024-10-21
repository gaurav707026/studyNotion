const express = require('express');

const app = express();

app.use(express.json());

const userRoute = require("./routes/User")
const profileRoute = require("./routes/Profile")
const paymentRoute = require("./routes/Payment")
const courseRoute = require("./routes/Course")

const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload  = require("express-fileupload");
const dotenv  = require("dotenv");

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
database.DBconnect();

// middleware

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: { fileSize: 50 * 1024 * 1024 },    
}));
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials: true,
    })
);

// clodinary connection
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/course", courseRoute);


// default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "your server is running up...",
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})