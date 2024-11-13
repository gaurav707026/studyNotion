// import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import {sidebarLinks} from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useState } from "react";


function Sidebar() {
    const {user, loading: profileLoading}  = useSelector((state) => state.profile);
    const {loading: authLoading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    if (authLoading || profileLoading) {
        return (
            <div className="flex flex-col justify-center items-center mx-auto mt-10">
                <div className="spinner"></div>
                <div>Loading...</div>
            </div>
        )
    }

    function clickHandler(){
        const data = {
            text1: "Are you sure?",
            text2: "You will be logged out of Study Notion.",
            btn1Text: "Logout",
            btn2Text: "Cancel",
            btn1Handler: () => dispatch(logout(navigate)),
            btn2Handler: () => setConfirmationModal(null)
        }
        setConfirmationModal(data);
    }

  return (
    <div>
        <div className="flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700
        h-[calc(100vh-3.5rem)] bg-richblack-800 py-10 sticky">
            <div className="flex flex-col ">
                {
                    sidebarLinks.map((link) => {
                        if(link.type && user?.accountType != link.type) return null;
                        return  (
                            <SidebarLink key={link.id} link={link} iconName={link.icon}/>
                        )
                        
                    })
                }
            </div>
            <div className="mx-auto my-2 h-[1px] w-10/12 bg-richblack-600"></div>
            <div className="flex flex-col">
                <SidebarLink link={{name: "Settings", path:"dashboard/settings"}} iconName={"VscSettingsGear"}/>
                <button className="text-sm font-medium text-richblack-300"
                onClick={clickHandler}>
                    <div className=" flex items-center gap-x-2 text-richblack-500 font-semibold ml-8 mt-2">
                        <VscSignOut className="text-lg"/>
                        <span>Logout</span>
                    </div>
                </button>
            </div>

        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default Sidebar