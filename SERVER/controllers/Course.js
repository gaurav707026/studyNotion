const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const user = require("../models/User");

const { imageUploader } = require("../utils/imageUploader");

// create course
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validate
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("instructor Details", instructorDetails);

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "You are not an instructor",
      });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "tag details is not found",
      });
    }

    // upload thumbnail to cloudinary
    const thumbnailImage = await imageUploader(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // creat an entry for new course
    const newCourse = new Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: [tagDetails._id],
      thumbnailImage: thumbnailImage.secure_url,
    });

    // add the new course to user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    // update the tag schema
    await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "failed to create course",
    });
  }
};

// get all courses
exports.getAllCourses = async (req, res) => {
  try {
    // fetch all courses
    const allCourses = await Course.find({}).populate("instructor").exec();

    // return response
    res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "failed to get all courses",
      error: error.message,
    });
  }
};

// get courseDetails

exports.getCourseDetails = async (req, res) => {
  try {
    // fetch course details
    const {courseId} = req.body;
    const courseDetails = await Course.find(
      {_id : courseId})
      .populate({
        path: 'instructor',
        populate: {
          path: 'additionalDetails'
        }
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection"
          
        }
      }).exec();

      // validate the course details
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: "Course could not be found with the course ID",
        });
      }

    // return response
    res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "failed to get course details",
      error: error.message,
    });
  }
};
