// import React from 'react'
import Template from '../components/core/Auth/Template'
import signup from '../assets/Images/signup.webp';
// import frame from '../assets/Images/frame.png';
import SignupForm from '../components/core/Auth/SignupForm';

function Signuppage() {
  return (
    <div className='w-full bg-black h-auto'>
        <Template
        title="Join the millions learning to code with StudyNotion for free"
        description1= "Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image= {signup}
        form = {<SignupForm/>}
         />

       
    </div>
  )
}

export default Signuppage