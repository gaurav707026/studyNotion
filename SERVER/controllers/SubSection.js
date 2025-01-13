const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    // console.log("request body: ", req.body);
    // fetch data from request body
    const { sectionId, title, description } = req.body;

    // extract file/video data
    const video = req.files.video;
    // console.log("video file", req.files.video);

    // validation
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary server
    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
    const timeDuration = `${uploadDetails.duration}`;

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
    ).populate("subSection");

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
      const {sectionId, subSectionId,  title, description } = req.body;
      console.log(req.body);
      const subSection = await SubSection.findById(subSectionId);

      // validation
      if (!subSection) {
        return res.status(400).json({
          success: false,
          message: "Subsection not found!!",
        });
      }

      if(title !== undefined){
        subSection.title = title;
      }
      if(description !== undefined){
        subSection.description = description;
      }

      if(req.files && re.files.video !== undefined){
        // extract file/video data
        const video = req.files.video;
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        subSection.videoUrl = uploadDetails.secure_url;
        subSection.timeDuration = `${uploadDetails.duration}`
      }

      await subSection.save();
      
      // update the subsection
      const updatedSection = await Section.findById(sectionId).populate("subSection");
      
      // return response
      return res.json({
        success: true,
        message: "Subsection updated successfully",
        data: updatedSection
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
        // console.log(req.body);
        const { subSectionId, sectionId } = req.body;

        // validation
        if (!subSectionId || ! sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        await Section.findByIdAndUpdate(
          {_id: sectionId},
          {
            $pull: {
              subSection: subSectionId,
            }
          }
        );

        const subSection = await SubSection.findByIdAndDelete({_id: subSectionId});

        if(!subSection){
          return res.status(404).json({
                success: false,
                message: "Subsection not found!!",
              });
        }
        // find the uodated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        // return response
        return res.json({
            success: true,
            message: "Subsection deleted successfully",
            data: updatedSection
        });

    } catch (error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "failed to delete the subsection"
        });
    }
}
