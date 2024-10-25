// import React from 'react'

import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import ContactDetails from "../components/ContactPage/ContactDetails";
import ContactForm from "../components/ContactPage/ContactForm";

function ContactUs() {
  return (
    <div>
      <Navbar />

      <div className="flex w-5/6 gap-6 justify-between mx-auto my-12">
        <div className="w-[35%]">
            <ContactDetails/>
        </div>
        <div className="w-[50%]">
          <ContactForm />
        </div>
      </div>
      <div>
        <div className="mt-4 mb-20">
            <h2 className="text-center text-3xl font-bold text-white">
                Review from Other Learners
            </h2>
        </div>
        {/* <ReviewSlider/> */}
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
