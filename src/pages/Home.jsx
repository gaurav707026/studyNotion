// import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import backgroundGradient1 from "../assets/Images/Ellipse1.png";
import backgroundGradient2 from "../assets/Images/Ellipse2.png";

import TimelineSection from "../components/core/HomePage/TimelineSection";

import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
function Home() {
  return (
    <div>
      <Navbar/>
      {/* section - 1 */}
      <div
        className="relative mx-auto flex flex-col w-11/12 items-center
         text-white justify-between max-w-maxContent"
      >
        <Link to={"/signup"}>
          <div
            className="group mt-16 p-[2px] mx-auto rounded-full bg-richblack-800 font-bold text-richblack-20
            transition-all duration-200 hover:scale-95 w-fit z-10"
          >
            <div className="flex items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold mt-6">
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </div>

        <div className="w-[90%] text-center text-lg font-bold text-richblack-300 mt-4">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkTo={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkTo={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        <div className="shadow-richblack-25 shadow-[15px_15px_2px_0] mx-3 my-12 w-4/5 ">
          <video muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* code section -1  */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-bold">
                Unlock Your
                <HighlightText text={"Coding Potential"} />
                with Our Online Courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkTo: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkTo: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>
                <html>
                <head><title>Example</title><linkrel="stylesheet"href="styles.css">
                </head>
                <body>
                <h1><ahref="/">Header</a>
                </h1>
                <nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>
                </nav>`}
            backgroundGradient={backgroundGradient1}
            codeColor={"text-blur-200"}
          />
        </div>

        {/* code section -2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-bold">
                Start
                <HighlightText text={"Coding in Seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkTo: "/login",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkTo: "/signup",
              active: false,
            }}
            codeblock={`#include <bits/>stdc++.h>
                using namespace std;
                // developed by gaurav kumar
                int main() {
                \u00A0\u00A0\u00A0 cout << "Hello, guys!" << endl;
                \u00A0\u00A0\u00A0 cout << "This website is designed for the
                \u00A0\u00A0\u00A0 purpose of providing best quality content 
                \u00A0\u00A0\u00A0 to the students!" << endl;
                \u00A0\u00A0\u00A0 cout << "I hope you enjoy it!" << endl;
                \u00A0\u00A0\u00A0 return 0;
                }`}
            backgroundGradient={backgroundGradient2}
            codeColor={"text-richblue-25"}
          />
        </div>
        <ExploreMore />
      </div>

      {/* section - 2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 flex flex-col items-center justify-between gap-5 mx-auto">
            <div className="h-[32px]"></div>
            <div className="flex flex-row gap-7 text-white my-32">
              <CTAButton active={true} linkTo={"/signup"}>
                <div className="flex items-center gap-3">
                  Explore Full Catelog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkTo={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>
        {/* section - 3 */}
        <div className="w-11/12 flex flex-col items-center justify-between gap-5 mx-auto">
          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* section - 4 */}
      <div className="bg-richblack-900">
        <div className="w-5/6 flex items-center justify-between gap-5 mx-auto">
          <InstructorSection />
        </div>
      </div>

      {/* footer */}
      <Footer/>
    </div>
  );
}

export default Home;
