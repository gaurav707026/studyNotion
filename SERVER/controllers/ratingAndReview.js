const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// create rating and review
exports.createRating = async (req, res) => {
    try{
        // get userID
        const userId = req.user._id;
        // fecth data from req body
        const { courseId, rating, review } = req.body;
        // check if user is enrolled or not
        const courseDetails = await Course.findOne(
            { _id: courseId,
                studentEnrolled: {$elemMatch: {$eq: userId}}
            });

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "student is not enrolled in this course"
            });
        }
        // check if user already reviewed the course
        const existingRating = await RatingAndReview.findOne({ 
            user: userId,
            course: courseId
        });
        
        if(existingRating){
            return res.status(403).json({
                success: false,
                message: "user has already reviewed this course"
            });
        }
        // create rating and review
        const newRating = new RatingAndReview.create({
            user: userId,
            course: courseId,
            rating,
            review
        });
        // save to database
        await Course.findByIdAndUpdate(courseId,
            {
                $push: {
                    ratingAndReview : newRating._id
                }
            },
            {new: true}
        );
        // return response
        return res.status(200).json({
            success: true,
            message: "Rating and review created successfully",
            data: newRating
        });


    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to create rating",
            error: error.message
        });
    }
}

// get average rating
exports.getAverageRating = async (req, res) => {
    try{
        // get courseId
        const courseId = req.body.courseId;
        // calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    }
                }
            }
        ])
        // return the average rating
        if(result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Average rating retrieved successfully",
                averageRating: result[0].averageRating
            });
        }
        // if no rating/review exist
        return res.status(200).json({
            success: true,
            message: "No rating/review found for this course",
            averageRating:0
        });


    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to get average rating",
            error: error.message
        });
    }
}

// get all rating and review

exports.getAllRatingAndReview = async (req, res) => {
    try{
        // get courseId
        const courseId = req.body.courseId;
        // fetch all rating and review
        const allRatingAndReview = await RatingAndReview.find({})
           .sort({rating: "desc"})
           .populate({
            path: "user",
            select: "firstName lastName email image"
           })
           .populate({
            path: "course",
            select: "courseName" 
           }).exec();
        // return all rating and review
        return res.status(200).json({
            success: true,
            message: "All rating and review retrieved successfully",
            data: allRatingAndReview
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to get all rating and review",
            error: error.message
        });
    }
} 