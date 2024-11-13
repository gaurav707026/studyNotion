// import React from 'react'
import { useSelector} from "react-redux"
import { Outlet} from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar";
import Navbar from "../components/common/Navbar"

function Dashboard() {
    const {loading: authLoading} = useSelector( (state) => state.auth);
    const {loading: profileLoading} = useSelector( (state) => state.profile);

    if (authLoading || profileLoading) {
        return (
            <div className="flex flex-col justify-center items-center mx-auto mt-10">
                <div className="spinner"></div>
                <div>Loading...</div>
            </div>
        )
    }

  return (
    <div className="overflow-hidden">
  <div className="fixed top-0 left-0 right-0 z-50 bg-richblack-800">
    <Navbar />
  </div>
  <div className="relative flex min-h-screen pt-14"> {/* Add padding to account for Navbar height */}
    <div className="w-60 fixed h-full overflow-y-auto"> {/* Fixed width for Sidebar */}
      <Sidebar />
    </div>
    <div className="flex-grow ml-60 overflow-y-auto"> {/* Allow Outlet to overflow */}
      <div className="w-11/12 min-w-[1000px] mt-12 flex justify-center my-8">
        <Outlet />
      </div>
    </div>
  </div>
</div>

  )
}

export default Dashboard