import { useForm } from "react-hook-form"
import IconBtn from "../../../../common/IconsBtn";
import { useState } from "react";
import { GrAddCircle } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { BiRightArrow } from "react-icons/bi";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "./NestedView";
function CourseBuilderForm() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [editSectionName, setEditSectionName] = useState(null);
    const { course } = useSelector((state) => state.course)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);

    const onSubmit = async (data) => {
        setLoading(true);
        let result;

        if (editSectionName) {
            result = await updateSection({
                sectionName: data.sectionName,
                sectionId: editSectionName,
                courseId: course._id,
            }, token);
        }
        else {
            result = await createSection({
                sectionName: data.sectionName,
                courseId: course._id,
            }, token)
        }
        // update values
        if (result) {
            dispatch(setCourse(result));
            setEditSectionName(null);
            setValue("sectionName", "");
        }
        // console.log(course);

        // laoding false
        setLoading(false);
    }

    const cancelEdit = () => {
        setEditSectionName(null);
        setValue("sectionName", "");
    }

    const goBack = () => {
        dispatch(setEditCourse(true));
        dispatch(setStep(1));
    }

    const goToNext = () => {
        if (course.courseContent.length === 0) {
            toast.error("Please add atleast one section!");
            return;
        }
        if (course.courseContent.some((section) => section.subSection.length === 0)) {
            toast.error("Please add atleast one lecture to each section!");
            return;
        }
        // if everything is fine
        dispatch(setStep(3));
    }

    const handleChangeEditSectionName = (sectionId, sectionName) => {
        if (editSectionName === sectionId) {
            cancelEdit();
            return;
        }
        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);
    }


    return (
        <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="text-2xl font-semibold text-richblack-5"> Course Builder</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="sectionName" className="text-sm font-semibold text-richblack-5">
                        Section Name <sup className="text-pink-300">*</sup>
                    </label>
                    <input
                        id="sectionName"
                        placeholder="Add Section name"
                        {...register("sectionName", { required: true })}
                        className="form-style w-full"
                    />
                    {
                        errors.sectionName && <span className=" ml-2 text-xs tracking-wide text-pink-400">Section Name is required.</span>
                    }
                </div>
                <div className="flex items-end gap-x-4">
                    <IconBtn
                        type="submit"
                        disabled={loading}
                        text={editSectionName ? "Edit Section Name" : "Create Section"}
                        outline={true}>
                        <GrAddCircle className="text-yellow-50" />
                    </IconBtn>
                    {
                        editSectionName && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="text-sm text-richblack-300 underline">
                                Cancel Edit
                            </button>
                        )
                    }
                </div>
            </form>

            {/* sections and subsection view */}
            {
                course?.courseContent?.length > 0 && (
                    <NestedView
                        handleChangeEditSectionName={handleChangeEditSectionName} />
                )
            }
            <div className="flex justify-end gap-x-3">
                <button
                    onClick={goBack}
                    className="rounded-md cursor-pointer flex items-center gap-x-2 bg-richblack-300 py-[8px] px-6 font-semibold text-richblack-900">
                    Back
                </button>
                <IconBtn
                    text="Next"
                    onclick={goToNext}>
                    <BiRightArrow className="text-richblack-900" />
                </IconBtn>
            </div>


        </div>
    )
}

export default CourseBuilderForm