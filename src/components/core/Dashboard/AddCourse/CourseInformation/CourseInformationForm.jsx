import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import RequirementField from "./RequirementField";
import ChipInput from "./ChipInput";
import Upload from "../Upload";
import IconsBtn from "../../../../common/IconsBtn";
import toast from "react-hot-toast";
import {setStep, setCourse} from "../../../../../slices/courseSlice"
function CourseInformationForm() {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const { course, editCourse } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);
    const { token } = useSelector((state) => state.auth);

    const getCategories = async () => {
        setLoading(true);
        const categories = await fetchCourseCategories();
        if (categories.length > 0) {
            // console.log(`Course categories`, categories);
            setCourseCategories(categories);
        }
        setLoading(false);
    };
    useEffect(() => {
        if (editCourse) {
            // set value for courseTitle, courseShortDesc,
            // courseprice, courseTags, courseBenefits, courseCategory,
            //  courseRequirements, courseImage
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.category);
            setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail);
        }
        getCategories();
    }, []);

    const isFormUpdated = () => {
        const currentValues = getValues();
        // console.log("currentValues: ", currentValues);
        // console.log("courses: ", course);
        if (course !== null &&
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.thumbnail !== course.thumbnail ||
            currentValues.courseRequirement.toString() !== course.instructions.toString()) return true;
        else return false;
    }

    // handle next button click
    const onSubmit = async (data) => {
        // console.log("data: ", data);
        if (editCourse) {
            if (isFormUpdated()) {
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId", course._id);
                if (currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle);
                }
                if (currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc);
                }
                if (currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice);
                }
                if(currentValues.courseTags.toString()!== course.tag.toString()){
                    formData.append("tag", data.courseTags.toString());
                }
                if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }
                if (currentValues.courseCategory._id !== course.category._id) {
                    formData.append("categoryId", data.courseCategory);
                }
                if(currentValues.thumbnail!== course.thumbnail){
                    formData.append("thumbnail", data.thumbnail);
                }
                if (currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                    formData.append("instructions", JSON.stringify(data.courseRequirements));
                }
                setLoading(true);
                const result = await editCourseDetails(formData, token);
                if (result) {
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
            }
            else {
                toast.error("No changes made to the form");
            }
            return;
        }

        // create a new course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("tag", data.courseTags.toString());
        formData.append("whatYouWillLearn", JSON.stringify(data.courseBenefits));
        formData.append("category", data.courseCategory);
        formData.append("thumbnail", data.thumbnail);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        setLoading(true);
        const result = await addCourseDetails(formData, token);
        if (result) {
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
        >
            {/* course title */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="courseTitle" className="text-sm text-richblack-5">
                    Course Title<sup className="text-pink-200">*</sup>
                </label>
                <input
                    id="courseTitle"
                    placeholder="Enter Course Title"
                    {...register("courseTitle", { required: true })}
                    className="w-full form-style"
                />
                {errors.courseTitle &&
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Title is required **
                    </span>}
            </div>

            {/* course short description */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="courseShortDesc" className="text-sm text-richblack-5">
                    Course Short Description<sup className="text-pink-200">*</sup>
                </label>
                <textarea
                    id="courseShortDesc"
                    placeholder="Enter Description"
                    {...register("courseShortDesc", { required: true })}
                    className="form-style resize-x-none min-h-[130px] w-full"
                />
                {errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Short Description is required **</span>
                )}
            </div>

            {/* course price */}
            <div className="flex flex-col space-y-2 relative">
                <label htmlFor="coursePrice" className="text-sm text-richblack-5">
                    Course Price<sup className="text-pink-200">*</sup>
                </label>
                <input
                    defaultValue=""
                    id="coursePrice"
                    placeholder="Enter Course Price"
                    {...register("coursePrice", {
                        required: true,
                        valueAsNumber: true,
                        pattern: {
                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        },
                    })}
                    className="w-full form-style !pl-12"
                />
                <HiOutlineCurrencyRupee className="absolute top-1/2 left-3 inline-block text-2xl -translate-y-1/2 text-richblack-400" />
                {errors.coursePrice && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is required **</span>}
            </div>

            {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

            {/* create a custom component fro tags handling */}
            <ChipInput
                label="Tags"
                name="courseTags"
                placeholder="Enter Tags and press enter"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />

            {/* create a component for uploading and showing preview of media */}
            <Upload
            name="thumbnail"
            label="Course Thumbnail"
            register={register}
            setValue={setValue}
            errors={errors}
            editData={editCourse ? course?.thumbnail:null}
            />

            {/* benefits of the course */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="courseBenefits" className="text-sm text-richblack-5">
                    Benefits of the course<sup className="text-pink-200">*</sup>
                </label>
                <textarea
                    id="courseBenefits"
                    placeholder="Enter Course Benefits"
                    {...register("courseBenefits", { required: true })}
                    className="form-style resize-x-none min-h-[130px] w-full"

                />
                {errors.courseBenefits && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Benefits is required **</span>}
            </div>

            <RequirementField
                name="courseRequirements"
                label="Requirements/Instruction"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />
            <div className="flex justify-end gap-x-2">
                {editCourse && (
                    <button
                        onClick={() => dispatch(setStep(2))}
                        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Continue without Saving
                    </button>
                )}
                <IconsBtn
                    text={!editCourse ? "Next" : "Save Changes"} >
                    <MdNavigateNext />
                </IconsBtn>
            </div>
        </form>
    );
}

export default CourseInformationForm;
