const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { imageUploader } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    // fetch data from request body
    const { sectionId, title, timeDuration, description } = req.body;

    // extract file/video data
    const video = req.files.File;

    // validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary server
    const uploadDetails = await imageUploader(video, process.env.FOLDER_NAME);

    // create a new section
    const subSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // update the section with subSection objectId
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSection._id } },
      { new: true }
    );

    // return response
    return res.json({
      success: true,
      message: "Subsection created successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update the subsection

exports.updateSubSection = async (req, res) => {
    try {
      // fetch data from request body
      const { subsectionId,  title, timeDuration, description } = req.body;
      const video = req.files.File;

      // validation
      if (!title ||!timeDuration ||!description ||!video) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      
      // upload video to cloudinary server
      const uploadDetails = await imageUploader(video, process.env.FOLDER_NAME);
      
      // update the subsection
      const updatedSubsection = await SubSection.findOneAndUpdate(
        {subsectionId},
        {
          title,
          timeDuration,
          description,
          videoUrl: uploadDetails.secure_url,
        },
        { new: true }
      );
      
      // return response
      return res.json({
        success: true,
        message: "Subsection updated successfully",
        updatedSubsection,
      });

    } catch (error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "failed to update the sunSection"
        });
    }
}

// delate the subSection

exports.deleteSubSection = async (req, res) => {
    try {
        // fetch data from request body
        const { subsectionId } = req.body;

        // validation
        if (!subsectionId) {
            return res.status(400).json({
                success: false,
                message: "Subsection ID is required",
            });
        }

        // find and delete the subsection
        await SubSection.findByIdAndDelete(subsectionId);

        // return response
        return res.json({
            success: true,
            message: "Subsection deleted successfully",
        });

    } catch (error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "failed to delete the subsection"
        });
    }
}
