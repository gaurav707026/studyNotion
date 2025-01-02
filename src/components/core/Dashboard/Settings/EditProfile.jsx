import { useState } from "react";
import countryCode from "../../../../data/countrycode.json";

function EditProfile() {
  const [profiledetail, setProfileDetail] = useState({
    Name: "",
    Profession: "",
    dateOfBirth: "",
    Gender: "Male",
    phoneNumber: "",
    countryCode: "",
    about: "",
  });

  const handleInputChange = (e) => {
    e.preventDefault();
    setProfileDetail({ ...profiledetail, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col  w-full items-center">
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
      <div className="flex justify-between items-start w-4/5 py-6 rounded-lg ">
        <div className="flex justify-end w-full gap-5">
          <button className="text-lg font-semibold text-white bg-richblack-700 px-8 py-3 rounded-lg border-b-[1px]">
            Cancel
          </button>
          <button className="text-lg font-semibold text-richblack-800 bg-yellow-25 px-8 py-3 rounded-lg border-b-[2px] border-richblack-50">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
