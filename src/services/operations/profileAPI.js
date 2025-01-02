import {toast} from "react-hot-toast";
import {setLoading, setUser} from "../../slices/profileSlice";
import {apiConnector} from "../apiconnector";
import {profileEndpoint} from "../apis"
import { logout } from "./authAPI";

const { GET_USER_DETAILS_API, GET_ENROLLED_COURSES, GET_INSTRUCTOR_DATA_API } = profileEndpoint;

// get user details 
export function getUserDetails(token, navigate){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("GET", GET_USER_DETAILS_API, null,
                {
                    Authorisation: `Bearer ${token}`,
                }
            )
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            const userImage = response.data.data.image
            ? response.data.data.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
            dispatch(setUser({...response.data.data, image: userImage}));
        }
        catch(error){
            dispatch(logout(navigate));
            toast.error("Failed to load user details");
            console.log(error);
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}
// get all the enrolled courses
export async function getUserEnrolledCourses(token){
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
        console.log("before calling backend");
        const response = await apiConnector("GET", GET_ENROLLED_COURSES, null,
            {
                Authorisation: `Bearer ${token}`,
            }
        )
        console.log("after calling backend");
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        result = response.data.enrolledCourses;
        toast.dismiss(toastId);
        return result;
    }
    catch(error){
        toast.dismiss(toastId);
        toast.error("Failed to load enrolled courses");
        console.log(error);
    }
};

export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
      const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, 
      {
        Authorization: `Bearer ${token}`,
      })
  
      console.log("GET_INSTRUCTOR_API_RESPONSE", response);
      result = response?.data?.courses
  
    }
    catch(error) {
      console.log("GET_INSTRUCTOR_API ERROR", error);
      toast.error("Could not Get Instructor Data")
    }
    toast.dismiss(toastId);
    return result;
  }