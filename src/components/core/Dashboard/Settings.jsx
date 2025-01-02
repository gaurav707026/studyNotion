import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import countryCode from "../../../data/countrycode.json";
import { RiDeleteBin6Line } from "react-icons/ri";

function Settings() {
  const [profiledetail, setProfileDetail] = useState({
    Name: "",
    Profession: "",
    dateOfBirth: "",
    Gender: "Male",
    phoneNumber: "",
    countryCode: "",
    about: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [removeDisplayPicture, setRemoveDisplayPicture] = useState(false);
  const { user } = useSelector((state) => state.profile);
  useEffect(() => {
    console.log(user);
  }, []);
  const handleInputChange = (e) => {
    e.preventDefault();
    setProfileDetail({ ...profiledetail, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-8  w-11/12 items-center">
      <div className="flex flex-col justify-start w-full gap-2">
        <div
          className="text-richblack-500 cursor-pointer flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <span>
            <IoIosArrowBack />
          </span>
          Back
        </div>
        <h1 className="text-2xl text-white text-left w-full">Edit Profile</h1>
      </div>

      {/* section -1  */}
      <div className="flex justify-between items-start w-4/5  bg-richblack-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <div className="flex w-full gap-8 items-center">
          <div>
            <img
              alt="profile-photo"
              src={`${user.image}`}
              width={80}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xl text-richblack-25 font-medium">
              Change Profile Picture
            </div>
            <div className="flex gap-x-3">
              <label className="">
                <div className=" bg-yellow-50 cursor-pointer gap-x-2 px-5 py-2 rounded-md text-richblack-900 font-semibold">
                  Upload
                </div>

                <input type="file" style={{ display: "none" }} />
              </label>
              <button
                className="flex items-center bg-richblack-500 cursor-pointer gap-x-2 px-5 rounded-md text-richblack-900 font-semibold"
                onClick={() => setRemoveDisplayPicture(!removeDisplayPicture)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* section - 2 */}
      <div className="flex justify-between items-start w-4/5  bg-richblack-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <form className="flex flex-col w-full gap-5">
          <p className="text-white text-xl font-medium">Profile Information</p>
          <div className="flex w-full justify-between items-center gap-6">

            {/* left part */}
            <div className="flex flex-col gap-5 w-1/2">
              <label className="flex flex-col gap-2">
                <div className="text-richblack-100 text-sm font-medium">
                  Display Name
                </div>
                <input
                  type="text"
                  value={profiledetail.Name}
                  onChange={handleInputChange}
                  name="Name"
                  placeholder="Enter your name..."
                  className="bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px]"
                />
              </label>

              <label className="flex flex-col gap-2">
                <div className="text-richblack-100 text-sm font-medium">
                  Date of Birth
                </div>
                <input
                  type="date"
                  value={profiledetail.dateOfBirth}
                  onChange={handleInputChange}
                  name="dateOfBirth"
                  placeholder="Enter your DOB..."
                  className="bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px]"
                />
              </label>

              <label className="flex flex-col gap-2 w-full">
                <div className="text-richblack-100 text-sm font-medium">
                  Phone Number
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-x-2 items-center w-20">
                    <select
                      value={profiledetail.countryCode}
                      onChange={handleInputChange}
                      name="countryCode"
                      className="bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px] w-20"
                    >
                      defaultValue={+91}
                      {countryCode.map((country) => {
                        return (
                          <option key={country.code} value={country.code}>
                            {country.code} {country.country}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <input
                    type="number"
                    maxLength="10"
                    value={profiledetail.phoneNumber}
                    onChange={handleInputChange}
                    name="phoneNumber"
                    placeholder="01234 56789"
                    style={{
                      appearance: "textfield", // Removes arrows for most browsers
                      MozAppearance: "textfield", // Firefox specific
                      WebkitAppearance: "none", // Chrome, Safari, Edge
                    }}
                    className="bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px] w-full appearance-none"
                  />
                </div>
              </label>
            </div>

            {/* right part */}
            <div className="flex flex-col gap-5 w-1/2">
              <label className="flex flex-col gap-2">
                <div className="text-richblack-100 text-sm font-medium">
                  Profession
                </div>
                <select
                  value={profiledetail.Profession}
                  onChange={handleInputChange}
                  name="Proffesion"
                  className="bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px]"
                >
                  <option value={"Developer"}>Developer</option>
                  <option value={"Designer"}>Designer</option>
                  <option value={"Tester"}>Tester</option>
                  <option value={"Student"}>Student</option>
                  <option value={"Other"}>Other</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <div className="text-richblack-100 text-sm font-medium">
                  Gender
                </div>
                <div className=" flex gap-8 bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px] ">
                  <label className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="Gender" // Same 'name' for all radio buttons
                      value="Male"
                      checked={profiledetail.Gender === "Male"} // Check selected value
                      onChange={handleInputChange} // Update state
                      className="w-4 h-4 text-yellow-50 bg-yellow-50 border-ring-yellow-50 focus:ring-yellow-50"
                      />
                    Male
                  </label>

                  <label className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="Gender"
                      value="Female"
                      checked={profiledetail.Gender === "Female"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-yellow-50 bg-yellow-50 border-ring-yellow-50 focus:ring-yellow-50"
                      />
                    Female
                  </label>

                  <label className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="Gender"
                      value="Other"
                      checked={profiledetail.Gender === "Other"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-yellow-50 bg-yellow-50 border-ring-yellow-50 focus:ring-yellow-50"
                    />
                    Other
                  </label>
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <div className="text-richblack-100 text-sm font-medium">
                  About
                </div>
                <input
                  type="text"
                  value={profiledetail.about}
                  onChange={handleInputChange}
                  name="about"
                  placeholder="Enter Bio Details"
                  className="bg-richblack-700 py-3 px-4 rounded-md text-richblack-300 border-b-[1px]"
                />
              </label>
            </div>

          </div>
        </form>
      </div>

      {/* section - 3 */}
      <div className="flex justify-between items-start w-4/5  bg-richblack-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <form className="flex flex-col w-full gap-5">
          <p className="text-white text-xl font-medium">Password</p>
          <div className="flex w-full justify-between items-center gap-6">
            <label className="flex flex-col gap-2 w-1/2">
              <div className="text-richblack-100 text-sm font-medium">
                Current Password
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
                New Password
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

      {/* delete section */}
      <div className="flex justify-between items-start w-4/5  bg-pink-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <div className="flex gap-6">
          <div className="text-[#401414] w-16 h-16 rounded-full bg-[#d03d3d97] flex justify-center items-center">
            <RiDeleteBin6Line className="w-8 h-8"/>
          </div>
          <div className="flex flex-col w-3/4 items-start">
            <h3 className="text-2xl font-semibold text-white">Delete Account</h3>
            <p className="text-white text-base">Would you like to delete account</p>
            <p className="text-white text-base">This account contains Paid Courses. Deleting your account will remove all the contain associated with it.</p>
            <button className="text-lg font-semibold text-pink-400">
              I Want to Delete My Account</button>
          </div>
          
        </div>
      </div>

      <div className="flex justify-between items-start w-4/5 py-6 rounded-lg ">
        <div className="flex justify-end w-full gap-5">
          <button className="text-lg font-semibold text-white bg-richblack-700 px-8 py-3 rounded-lg border-b-[1px]">
            Cancel</button>
            <button className="text-lg font-semibold text-richblack-800 bg-yellow-25 px-8 py-3 rounded-lg border-b-[2px] border-richblack-600">
            Save</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
