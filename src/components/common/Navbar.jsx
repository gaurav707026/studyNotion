// import React from 'react'

import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";
import { VscTriangleUp } from "react-icons/vsc";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);

  const fetchSubLink = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data);
      // console.log(result.data);
    } catch (err) {
      console.log(err);
      console.log("could not fetch category");
    }
  };
  useEffect(() => {
    fetchSubLink();
  }, []);

  function matchRoute(route) {
    return matchPath({ path: route }, location.pathname);
  }
  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-500">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* logo */}
        <Link to="/">
          <img
            src={logo}
            className="w-[160px] "
            loading="lazy"
            alt="Main Logo"
          />
        </Link>

        {/* nav Links */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25 ">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="relative group">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <p>{link.title}</p>
                      <IoIosArrowDown />
                    </div>
                    <div className="absolute invisible flex flex-col items-center  transition-all group-hover:visible group-hover:z-50">
                      <VscTriangleUp size="32px" className="z-30" />
                      <div className="bg-richblack-25 text-richblack-700 flex flex-col justify-center px-2 py-3 z-30 gap-2 -mt-[10px] rounded-md">
                        {subLinks.length != 0 ? (
                          subLinks.map((subLink, subIndex) => (
                            <Link
                              key={subIndex}
                              to={`/category/${subLink._id}`}
                            >
                              <p className="px-6 py-2 rounded-md hover:bg-richblack-700 hover:text-richblack-25">
                                {subLink.name}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <p>No categories available</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* login signup and dashboard */}
        <div className="flex gap-x-4 items-center ">
          {user && user?.accountType != "Instructor" && (
            <Link to={`/dashboard/cart`}>
              <AiOutlineShoppingCart className="text-white font-bold text-xl"/>
              {totalItems > 0 && (
                <span className="text-red-500 font-bold">{totalItems}</span>
              )}
            </Link>
          )}
          {/* login button */}
          {token === null && (
            <Link to={`/login`}>
              <button
                className="text-richblack-25 border-[1px]
                                 border-richblack-600 bg-richblack-800 py-[8px]
                                 px-[15px] rounded-md"
              >
                Login
              </button>
            </Link>
          )}

          {/* signup button */}
          {token === null && (
            <Link to="/signup">
              <button
                className="text-richblack-25 border-[1px]
                                 border-richblack-600 bg-richblack-800 py-[8px]
                                  px-[15px] rounded-md"
              >
                Sign Up
              </button>
            </Link>
          )}
          
          {/* dashboard */}
          {token != null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
