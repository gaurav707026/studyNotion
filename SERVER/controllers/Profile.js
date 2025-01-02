const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader"); 
const mongoose = require("mongoose");
// update the profile

exports.updateProfile = async (req, res) => {
  try {
    // get data
    const {
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender,
    } = req.body;

    // get userId
    const userId = req.user.id;

    // validation
    // if (!dateOfBirth ||!about ||!contactNumber ||!gender|| !userId) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "All fields are required"
    //     });
    // }

    // find profile
    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// deleteAccount
exports.deleteAccount = async (req, res) => {
  try {
    // get userId
    const userId = req.user.id;

    // validation
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile
    const profileId = userDetails.additionalDetails;
    await Profile.findByIdAndDelete({ _id: profileId });

    // delete associated courses
    for(const courseId of userDetails.courses){
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: {
                    studentEnrolled: userId,
                },
            },
            { new: true }
        )
    }

    // delete user
    await User.findByIdAndDelete({ _id: userId });

    // return response
    return res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "unable to delete your account",
    });
  }
};

// get userDetails
exports.getUserDetails = async (req, res) => {
  try {
    // get userId
    const userId = req.user.id;

    // validation and get user details
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // return response
    return res.status(200).json({
      data: userDetails,
      success: true,
      message: "User details fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Can't fetch user Detail ",
    });
  }
};

// update prpfile picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    // get userId
    const userId = req.user.id;
    // get file from request
    const displayPicture = req.files.displayPicture;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    // update user profile
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    // send success message
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all enrolled courses

exports.getAllEnrolledCourses = async (req, res) => {
  try {
    // get userId
    const userId = req.user.id;

    // get user's enrolled courses
    let userDetails = await User.findOne({
      _id: userId,
    }).populate({
      path: "courses",
      populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      },
    }).exec();
    // validate userDetails
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    };
    userDetails = userDetails.toObject();
    var SubsectionalLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionalLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].courseContent[j].totalDuration =
          convertSecondsToDuration(totalDurationInSeconds);

        SubsectionalLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionalLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        userDetails.courses[i].progressPercentage =
          Math.round((courseProgressCount / SubsectionalLength) * 100 * 100) /
          100;
      }

      // return response
      return res.status(200).json({
        success: true,
        message: "All enrolled courses fetched successfully",
        data: userDetails.courses,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// instructor dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // create a new object with the additional fileds
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats;
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "Instructor dashboard data fetched successfully",
      courses: courseData,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
