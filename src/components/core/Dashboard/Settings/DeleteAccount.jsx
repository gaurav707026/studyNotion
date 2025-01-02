import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { deleteProfile } from "../../../../services/operations/settingsAPI";


function DeleteAccount() {
    const [confirmationModal, setConfirmationModal] = useState(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token} = useSelector((state)=>state.auth);

    function deleteAccountHandler(){
        const data = {
            text1: "Are you sure?",
            text2: "Your Account will be Deleted Permanently",
            btn1Text: "Delete",
            btn2Text: "Cancel",
            btn1Handler: () => dispatch(deleteProfile(token, navigate)),
            btn2Handler: () => setConfirmationModal(null)
        }
        setConfirmationModal(data);
    }
  return (
    <div className="flex flex-col  w-full items-center">
        <div className="flex gap-x-6 w-4/5  bg-pink-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <div className="text-[#401414] w-16 h-16 rounded-full bg-[#d03d3d97] flex justify-center items-center">
          <RiDeleteBin6Line className="w-8 h-8" />
        </div>
        <div className="flex flex-col w-3/4 items-start">
          <h3 className="text-2xl font-semibold text-white">Delete Account</h3>
          <p className="text-white text-base">
            Would you like to delete account
          </p>
          <p className="text-white text-base">
            This account contains Paid Courses. Deleting your account will
            remove all the contain associated with it.
          </p>
          <button className="text-lg font-semibold text-pink-400"
          onClick={deleteAccountHandler}>
            I Want to Delete My Account
          </button>
        </div>
      </div>
      {
        confirmationModal &&
        <div className="w-full flex justify-center items-center">
            <ConfirmationModal modalData={confirmationModal}/>
        </div>
      }
    </div>
  );
}

export default DeleteAccount;
