// import React from 'react'

function ConfirmationModel({modalData}) {

  return (
    <div className="absolute left-[40%] top-[35%] p-8 border-[1px] border-richblack-500 rounded-lg text-richblack-50">
      <div className="flex flex-col gap-2 ">
        <h2 className="text-3xl font-semibold">{modalData.text1}</h2>
        <p className="text-md text-richblack-300">{modalData.text2}</p>
      </div>
      <div className="flex justify-between mt-5">
        <button className="px-4 py-2 bg-yellow-50 rounded-lg text-richblack-700" 
        onClick={modalData.btn1Handler}>{modalData.btn1Text}</button>
        <button className="px-4 py-2 bg-richblack-500 rounded-lg text-white" 
         onClick={modalData.btn2Handler}>{modalData.btn2Text}</button>
      </div>
    </div>
  )
}

export default ConfirmationModel