import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col   w-11/12 items-center">
      <div className="flex flex-col justify-start w-full gap-2">
        <div
          className="text-richblack-500 font-semibold  cursor-pointer flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <span>
            <IoIosArrowBack className="font-semibold" />
          </span>
          Back
        </div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">
          Edit Profile
        </h1>
      </div>
      <div className="flex flex-col w-full">
      <ChangeProfilePicture />
      <EditProfile />
      <UpdatePassword />
      <DeleteAccount />

      </div>
    </div>
  );
}

export default Settings;
