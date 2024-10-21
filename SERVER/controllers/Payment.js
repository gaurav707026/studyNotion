const {instance} = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User"); 
const mailSender = require("../utils/mailSender");

// capture the payment and initialte the razorpay order
exports.capturePayment = async (req, res) => {
    try{
        // get courseid and userid
        const {course_id} = req.body;
        const userId = req.user.id
        // validation

        // validate courseid 
        if(!course_id) {
            return res.status(404).json({
                success: false,
                message: "please provide a valid course id",
            });
        }
        
        // validate courseDetails
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(404).json({
                    success: false,
                    message: "course not found",
                });
            }

            // does user already pay the same course
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "user already enrolled in this course",
                });
            }

        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        // create order
        const amount = course.price;
        const currency = "INR";

        const options = {
            // amount and currency are mendatory
            amount: amount * 100, // amount in paisa
            currency: currency,
            receipt: Math.random(Date.now().toString()),
            notes: {
                course_id: course_id,
                user_id: userId
            }
        }

        try{
            // initialize the payment using razorpay
            const response = await instance.orders.create(options);
            console.log(response);

            // return response
            return res.status(200).json({
                success: true,
                message: "Order created successfully",
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: response.id,
                amount: response.amount,
                currency: response.currency,
            });
 
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: "Could not initialize the order",
            });
        }

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}



// verify signature
exports.verifyPayment = async (req, res) =>{
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    // to create the encrypted signature
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    // compare the signatures
    if(signature === digest){
        console.log("Payment is authorized!!");
        // update the user's enrolled courses
        const {courseId, userId} = req.body.payload.payment.entity.notes;
        try{
            // find the course and enroll the user in it 
            const enrolledCourse =  await Course.findByIdAndUpdate(
                courseId,
                {
                    $push: {
                        studentEnrolled: userId,
                    }
                },
                {new: true}
            );
            if(!enrolledCourse){
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            console.log("Enrolled Course", enrolledCourse)

            // find the student and add course to their list
            const student = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                    }
                },
                {new: true}
            );
            if(!student){
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            console.log("Student enrolled", student);

            // send email to the student
            const email = student.email;
            const mailSender = await mailSender(email, "Congratulations from the studyNotion", "Congratulations, you are onborded into the new course of study notion");

            console.log("Email sent", mailSender);

            
            // return respone
            return res.status(200).json({
                success: true,
                message: "signature verified and course added successfully",
            });
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid signature"
        });
    }                   
}