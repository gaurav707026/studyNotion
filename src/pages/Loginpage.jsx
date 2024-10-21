// import React from 'react'
import Template from '../components/core/Auth/Template'
import login from "../assets/Images/login.webp";
// import frame from "../assets/Images/frame.png"
import LoginForm from '../components/core/Auth/LoginForm';

function Loginpage() {


  return (
    <div className='h-screen overflow-x-hidden w-full bg-black'>
        <Template 
        title = "Welcome Back"
        description1 = "Build skills for today, tomorrow, and beyond."
        description2 = "Education to future-proof your career."
        image = {login}
        form = {<LoginForm/>}
        />
    </div>
  )
}

export default Loginpage