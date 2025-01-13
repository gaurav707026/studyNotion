const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
// create course
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    console.log("request body: ", req.body);
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      instructions,
      status,
    } = req.body;

    const thumbnail = req.files.thumbnail;

    // validate
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!status || status === undefined) {
      status = "Draft"
    } 

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    // console.log("instructor Details", instructorDetails);

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "You are not an instructor",
      });
    }

    // check for the category
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "category  is not found",
      });
    }

    // upload thumbnail to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    // console.log("thumbnailImage", thumbnailImage);

    // creat an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      instructions,
      thumbnail: thumbnailImage.secure_url,
      status: status,
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

    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
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

// Edit course details
exports.editCourse = async function (req, res) {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // if thumbnail is found update it
    if (req.files) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all courses
exports.getAllCourses = async (req, res) => {
  try {
    // fetch all courses
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    if (!allCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found",
      });
    }

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
    const { courseId } = req.body;
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // validate the course details
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course could not be found with the course ID",
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // return response
    res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: { courseDetails, totalDuration },
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

exports.getFullCourseDetails = async (req, res) => {
  try {
    // fetch course details
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseprogessCount = await CourseProgress.findOne({
      course: courseId,
      user: userId,
    });

    console.log("courseProgessCount: ", courseprogessCount);
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course could not be found with the course ID",
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseprogessCount?.completedVideos
          ? courseprogessCount.completedVideos
          : [],
      },
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

// get a list of all the courses of an instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // get instructor id from the request body
    const { instructorId } = req.body;
    // fetch all courses of the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    if (!instructorCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this instructor",
      });
    }
    // return response
    return res.status(200).json({
      success: true,
      message: "Instructor's courses fetched successfully",
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructor's courses",
      error: error.message,
    });
  }
};

// controller fro deleting a course

exports.deleteCourse = async (req, res) => {
  try {
    // get course id from the request body
    const { courseId } = req.body;
    // find the course
    const course = await Course.findById(courseId);

    // if course not found, return error
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // unenroll students from the course
    const studentsEnrolled = course.studentEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { enrolledCourses: courseId },
      });
    }

    // delete section and subsections
    const courseSection = course.courseContent;
    for (const sectionId of courseSection) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subsections = section.subSection;
        for (const subsectionId of subsections) {
          await SubSection.findByIdAndDelete(subsectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    // delete course
    await Course.findByIdAndDelete(courseId);

    // if course deleted successfully, return success message
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
