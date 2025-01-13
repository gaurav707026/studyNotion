import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux";
import { BiRightArrow } from "react-icons/bi";
import IconBtn from "../../../../common/IconsBtn";
import { useSelector } from "react-redux";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import {COURSE_STATUS} from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";

function PublishCourse() {
    const { register, handleSubmit, setValue, getValues } = useForm();
    const { course } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=> {
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public", true);
        }
    }, [])

    const goToCourses = () => {
        dispatch(resetCourseState());
        // navigate to /dashboard/my-course
        navigate("/dashboard/my-courses");

    }

    const handleCoursePublish = async () => {
        if(course?.status === COURSE_STATUS.PUBLIC && getValues("public") === true ||
    (course?.status === COURSE_STATUS.DRAFT && getValues("public")=== false)){
            // no updation in the form 
            // no need to make api calls
            goToCourses();
            return;
        }
        //else form is updated
        const formData = new FormData();
        formData.append("courseId", course?._id);
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("status", courseStatus);

        setLoading(true);
        const result = editCourseDetails(formData, token);
        if(result){
            goToCourses();
        }
        setLoading(false);
    }
    const onSubmit = async () => {
        handleCoursePublish();
    }
    const goBack = () => {
        dispatch(setStep(2));
    }

    
    return (
        <div className="rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700">
            <p className="text-2xl font-semibold text-richblack-5">Publish Settings</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-6 mb-8">
                    <label htmlFor="public" className="inline-flex items-center text-lg">
                        <input
                            type="checkbox"
                            id="public"
                            {...register("public")}
                            className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                        />
                        <span className="ml-2 text-richblack-400">Make this course as Public</span>
                    </label>
                </div>

                {/* back and save chanegs button */}
                <div className="flex justify-end gap-x-3">
                    <button
                        onClick={goBack}
                        className="rounded-md cursor-pointer flex items-center gap-x-2 bg-richblack-300 py-[8px] px-6 font-semibold text-richblack-900">
                        Back
                    </button>
                    <IconBtn
                        disabled={loading}
                        text="Publish Course"
                        onclick={onSubmit}>
                        <BiRightArrow className="text-richblack-900" />
                    </IconBtn>
                </div>
            </form>
        </div>
    )
}

export default PublishCourse