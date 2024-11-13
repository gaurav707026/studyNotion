// import React from 'react'
import * as Icons from "react-icons/vsc";
import { useLocation, NavLink, matchPath } from "react-router-dom";

function SidebarLink({link, iconName}) {
    const Icon = Icons[iconName];
    const location = useLocation();

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }
  return (
    <NavLink to={link.path} 
    className={`relative px-8 py-2 text-sm font-medium font-semibold ${matchRoute(link.path)? 
    "bg-yellow-800 border-l-4 border-yellow-50 text-yellow-50":"bg-opacity-0 border-none text-richblack-500"}`}>
        <span className={` top-0 left-0 h-full
        w-[0.2rem] bg-yellow-50 ${matchRoute(link.path) ? "opacity-100":"opacity-0"}`}></span>

         <div className="flex items-center gap-x-2 ">
            <Icon className="text-lg"/>
            <span>{link.name}</span>
         </div>
        
    </NavLink>
  )
}

export default SidebarLink