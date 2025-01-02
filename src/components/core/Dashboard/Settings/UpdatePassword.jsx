import { useState } from "react";

function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  return (
    <div className="flex flex-col  w-full items-center">
      <div className="flex justify-between items-start w-4/5  bg-richblack-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <form className="flex flex-col w-full gap-5">
          <p className="text-white text-xl font-medium">Change Password</p>
          <div className="flex w-full justify-between items-center gap-6">
            <label className="flex flex-col gap-2 w-1/2">
              <div className="text-richblack-100 text-sm font-medium">
                Current Password <span><sup className="text-[#f00]">*</sup></span>
              </div>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                name="currentPassword"
                placeholder="Enter current password..."
                className="bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px]"
              />
            </label>
            <label className="flex flex-col gap-2 w-1/2">
              <div className="text-richblack-100 text-sm font-medium">
                New Password <span><sup className="text-[#f00]">*</sup></span>
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                name="newPassword"
                placeholder="Enter new password..."
                className="bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px]"
              />
            </label>
          </div>
        </form>
      </div>
      <div className="flex justify-between items-start w-4/5 py-6 rounded-lg ">
        <div className="flex justify-end w-full gap-5">
          <button className="text-lg font-semibold text-white bg-richblack-700 px-8 py-3 rounded-lg border-b-[1px]">
            Cancel
          </button>
          <button className="text-lg font-semibold text-richblack-800 bg-yellow-25 px-8 py-3 rounded-lg border-b-[2px] border-richblack-50">
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePassword