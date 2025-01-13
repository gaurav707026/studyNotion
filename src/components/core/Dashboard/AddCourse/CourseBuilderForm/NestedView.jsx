import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { BiSolidDownArrow } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice"
import SubSectionModal from "./SubSectionModal";

function NestedView({ handleChangeEditSectionName }) {

    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);

    const [confirmationModal, setConfirmationModal] = useState(null);


    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({
            sectionId,
            courseId: course._id,
            token
        });

        if (result) {
            dispatch(setCourse(result));
        }
        setConfirmationModal(null);
    }
    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const result = await deleteSubSection({
            subSectionId,
            sectionId
        },
            token
        );
        // console.log("result: ", result);
        if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === sectionId ? result : section);
            const updatedCourse = { ...course, courseContent: updatedCourseContent };
            dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null);
    }

    return (
        <div>
            <div className="rounded-lg bg-richblack-700 p-6 px-8 border-t-2 border-y-2 border-t-richblack-600 border-y-richblack-600 ">
                {course?.courseContent?.map((section) => (
                    <details key={section._id} open className="border-t-2 border-y-2 border-t-richblack-600 border-y-richblack-600 mb-3">
                        <summary className="flex cursor-pointer items-center justify-between gap-x-3 py-2">
                            <div className="flex items-center gap-x-3">
                                <RxDropdownMenu className="text-2xl text-richblack-50" />
                                <p className="font-semibold text-richblack-50">
                                    {section?.sectionName}
                                </p>
                            </div>

                            <div className="flex items-center gap-x-3">
                                {/* section edit button */}
                                <button type="button" onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}>
                                    <MdEdit size={20} className="cursor-pointer text-xl text-richblack-300" />
                                </button>

                                {/* Section delete button */}
                                <button type="button" className=""
                                    onClick={() => setConfirmationModal({
                                        text1: "Delete this section",
                                        text2: "All the lectures in this section will be deleted",
                                        btn1Text: "Delete",
                                        btn2Text: "Cancel",
                                        btn1Handler: () => handleDeleteSection(section._id),
                                        btn2Handler: () => setConfirmationModal(null)

                                    })}>
                                    <RiDeleteBin6Line size={20} className="cursor-pointer text-xl text-richblack-300" />
                                </button>
                                <span className="font-medium text-richblack-300">|</span>
                                <BiSolidDownArrow className="text-xl text-richblack-300" />
                            </div>
                        </summary>
                        <div className="px-6 pt-3">
                            {/* render all the subsection within a section */}
                            {
                                section.subSection.map((data) => {
                                    return (
                                        <div key={data?._id}
                                            onClick={() => setViewSubSection(data)}
                                            className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2">
                                            <div className="flex items-center gap-x-3 py-2">
                                                <RxDropdownMenu className="text-2xl text-richblack-50" />
                                                <p className="font-semibold text-richblack-50">
                                                    {data.title}
                                                </p>
                                            </div>
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-x-3">

                                                {/* subsection edit button */}
                                                <button
                                                    onClick={() =>
                                                        setEditSubSection({ ...data, sectionId: section._id })
                                                    }>
                                                    <MdEdit className="text-xl text-richblack-300" />
                                                </button>

                                                {/* subsection delete button */}
                                                <button type="button"
                                                    onClick={() => setConfirmationModal({
                                                        text1: "Delete this Sub Section",
                                                        text2: "Selected lecture will be deleted",
                                                        btn1Text: "Delete",
                                                        btn2Text: "Cancel",
                                                        btn1Handler: () => handleDeleteSubSection(data?._id, section._id),
                                                        btn2Handler: () => setConfirmationModal(null)

                                                    })}>
                                                    <RiDeleteBin6Line size={20} className="cursor-pointer text-xl text-richblack-300" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>

                        {/* Add new lecture to the section */}
                        <button
                            onClick={() => setAddSubSection(section._id)}
                            className="flex items-center gap-x-1 text-yellow-50 border-2 border-yellow-50 rounded-full font-semibold px-3 py-1">
                            <AiOutlinePlus className="text-lg" />
                            <p>Add Lecture</p>
                        </button>

                    </details>
                ))}
            </div>
            {
                addSubSection ? (<SubSectionModal
                    modalData={addSubSection}
                    setModalData={setAddSubSection}
                    add={true} />)
                    : viewSubSection ? (<SubSectionModal
                        modalData={viewSubSection}
                        setModalData={setViewSubSection}
                        view={true} />)
                        : editSubSection ? (<SubSectionModal
                            modalData={editSubSection}
                            setModalData={setEditSubSection}
                            edit={true} />)
                            : <div></div>
            }
            {
                confirmationModal && (
                    <ConfirmationModal modalData={confirmationModal} />
                )
            }
        </div>
    )
}

export default NestedView