import { useSelector } from "react-redux";
import IconsBtn from "../../../common/IconsBtn";
function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart);
  function handleBuyCourse() {
    const courses = cart.map((course) => course._id)
    console.log("Brought these course:", courses);
    // todo: api integrate ->payment gateway tak lekar jayegi
  }
  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconsBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />    
    </div>
  );
}

export default RenderTotalAmount;
