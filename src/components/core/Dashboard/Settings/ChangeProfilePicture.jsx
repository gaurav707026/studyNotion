import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import IconBtn from "../../../common/IconsBtn";
import { FiUpload } from "react-icons/fi"
import { updateDisplayPicture } from "../../../../services/operations/settingsAPI";
import toast from "react-hot-toast";


function ChangeProfilePicture() {
  const { user } = useSelector((state)=> state.profile);
  const { token }  = useSelector((state)=> state.auth);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);


  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }
  const handleFileUpload= () => {
    try{
      console.log('Uploading...');
      setloading(true);
      const formData = new FormData();
      formData.append('displayPicture', imageFile);
      dispatch(updateDisplayPicture(token, formData)).then(()=>{
        setloading(false);
        toast.success("profile picture updated successfully")
      })
    }
    catch(error){
      console.log(error);
      setloading(false);
      toast.error("Failed to update profile picture")
    }
  }
  useEffect(() => {
    if(imageFile){
      previewFile(imageFile);
    }
  }, [imageFile]);
  
  return (
    <div className="flex flex-col  w-full items-center mb-8">
        <div className="flex justify-between items-start w-4/5  bg-richblack-800 px-8 py-6 rounded-lg border-[1px] border-richblack-300">
        <div className="flex w-full gap-8 items-center">
          <div>
            <img
              alt={`Profile-${user?.firstName}`}
              src={previewSource || user?.image}
              width={80}
              className="rounded-full aspect-square object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xl text-richblack-25 font-medium">
              Change Profile Picture
            </div>
            <div className="flex flex-row gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />
              <button
                onClick={handleClick}
                disabled={loading}
                className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
              >
                Select
              </button>
              <IconBtn
                text={loading ? "Uploading..." : "Upload"}
                onclick={handleFileUpload}
              >
                {!loading && (
                  <FiUpload className="text-lg text-richblack-900" />
                )}
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeProfilePicture