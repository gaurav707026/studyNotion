const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
  try {
    // fetch data
    const { sectionName, courseId } = req.body;

    // data validations required
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    // create a new section
    const newSection = await Section.create({ sectionName });
    // update course with section objectID
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        }
      })
      .exec();

    // return response
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to create section",
      error: error.message,
    });
  }
};
exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId, courseId } = req.body;

    // data validation
    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    // find and update section
      await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );
    const updatedCourse = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      }
    })
    .exec();

    // return updated data
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedCourse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // data input
    const { sectionId, courseId } = req.body;

    // data validation
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      }
    })

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // delete all the subsection that the section have
    await SubSection.deleteMany({_id: {$in: section.subSection}})

    // Finally delete the section
    await Section.findByIdAndDelete(sectionId);

    const updatedCourse = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      }
    })
    .exec();

    // return success message
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete section",
      error: error.message,
    });
  }
};
