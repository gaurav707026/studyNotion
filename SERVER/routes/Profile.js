const express = require("express");
const router = express.Router();

// Import routes
const {
  deleteAccount,
  updateProfile,
  getUserDetails,
  updateDisplayPicture,
  getAllEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

// Middleware to authenticate user
const { auth, isInstructor } = require("../middlewares/auth");

// profile routes
router.delete("/deleteProfile", auth, deleteAccount);

router.put("/updateProfile", auth, updateProfile);

router.get("/getUserDetails", auth, getUserDetails);

router.put("/updateDisplayPicture", auth, updateDisplayPicture);

router.get("/getEnrolledCourses", auth, getAllEnrolledCourses);

router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
