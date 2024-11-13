import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";

// import React from 'react'

function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(user);
  })


  return (
    <div className="flex flex-col gap-8  w-11/12 items-center">
      <h1 className="text-3xl text-white  w-4/5 text-left">
        My Profile
      </h1>
      {/* section - 1 */}
      <div className="flex justify-between w-4/5  bg-richblack-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <div className="flex gap-8 items-center">
          <img
            src={`${user?.image}`}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-4">
            <p className="text-white text-2xl font-medium ">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-richblack-500 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="flex gap-2 items-center text-richblack-700 bg-yellow-50 px-8 font-semibold py-2 rounded-lg "
            onClick={() => {
              navigate("/dashboard/settings");
            }}
          >
            Edit
            <FiEdit />
          </button>
        </div>
      </div>

      {/* section - 2 */}
      <div className="flex justify-between w-4/5  bg-richblack-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <div className="flex gap-8 items-center">
          <div className="flex flex-col gap-5">
            <p className="text-white text-xl font-medium ">
              About
            </p>
            <p className="text-richblack-500 text-sm">
                {user?.additionalDetails?.about ?? "write something about yourself"}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="flex gap-2 items-center text-richblack-700 bg-yellow-50 px-8 font-semibold py-2 rounded-lg "
            onClick={() => {
              navigate("/dashboard/settings");
            }}
          >
            Edit
            <FiEdit />
          </button>
        </div>
      </div>

      {/* section - 3 */}
      <div className="flex justify-between items-start w-4/5  bg-richblack-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
          <div className="flex flex-col w-full gap-5">
            <p className="text-white text-xl font-medium ">
              Personal Details
            </p>
            <div className="flex w-3/4 justify-between items-center">
                {/* left part */}
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-richblack-500">First Name</p>
                        <p className="text-lg text-richblack-50">{user?.firstName}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-richblack-500">Email</p>
                        <p className="text-lg text-richblack-50">{user?.email}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-richblack-500">Gender</p>
                        <p className="text-lg text-richblack-50">{user?.additionalDetails?.gender ?? "N/A"}</p>
                    </div>

                </div>
                {/* right part */}
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-richblack-500">Last Name</p>
                        <p className="text-lg text-richblack-50">{user?.lastName}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-richblack-500">Phone Number</p>
                        <p className="text-lg text-richblack-50">{user?.additionalDetails?.contactNumber ?? "N/A"}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-richblack-500">Date of Birth</p>
                        <p className="text-lg text-richblack-50">{user?.additionalDetails?.dateOfBirth ?? "N/A"}</p>
                    </div>

                </div>
                
            </div>
          </div>
        {/* edit button */}
        <div className="flex items-center">
          <button
            className="flex gap-2 items-center text-richblack-700 bg-yellow-50 px-8 font-semibold py-2 rounded-lg "
            onClick={() => {
              navigate("/dashboard/settings");
            }}
          >
            Edit
            <FiEdit />
          </button>
        </div>


      </div>


    </div>
  );
}

export default MyProfile;
