const express = require("express");
const router = express.Router();

// impoer the controller

// course controller
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

// categrorise controller
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");

// section controller
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// sub-section controller
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

// rating and review controller

const {
  createRating,
  getAverageRating,
  getAllRatingAndReview,
} = require("../controllers/RatingAndReview");

// course progress controller

// import middleware
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// course router----------------------------------------------------------------
// course can only be created by a instructor

router.post("/course", auth, isInstructor, createCourse);

// add a section to a course
router.post("/addSection", auth, isInstructor, createSection);

// update a section in a course

router.post("/updateSection", auth, isInstructor, updateSection);

// delete a section from a course

router.post("/deleteSection", auth, isInstructor, deleteSection);

// add a subsection to a section

router.post("/addSubsection", auth, isInstructor, createSubSection);

// get all courses

router.get("/getAllCourses", getAllCourses);

// get course details for a specific course

router.post("/getCourseDetails", getCourseDetails);

// update sub Section

router.post("/updateSubsection", auth, isInstructor, updateSubSection);

// delete sub section

router.post("/deleteSubsection", auth, isInstructor, deleteSubSection);


// category route----------------------------------------------------------------

// category can only be created by admin

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// rating and review route---------------------------------------------------------
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReview", getAllRatingAndReview);

module.exports = router;