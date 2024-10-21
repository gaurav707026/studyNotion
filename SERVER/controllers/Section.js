const Section = require("../models/Section");
const Course = require("../models/Course");

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
    );
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
    try{
        // data input
        const {sectionName, sectionId} = req.body;

        // data validation
        if(!sectionName ||!sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            });
        }

        // find and update section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                sectionName
            },
            {new: true}
        ); 

        // return updated data
        return res.status(200).json({
            success: true,
            message: "Section updated successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to update section",
            error: error.message
        });
    }
}

exports.deleteSection = async (req, res) => {
    try{
        // data input
        const {sectionId} = req.body;
        
        // data validation
        if(!sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            });
        }

        // find and delete section
        await Section.findByIdAndDelete(sectionId);

        // return success message
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to delete section",
            error: error.message
        });
    }
}
