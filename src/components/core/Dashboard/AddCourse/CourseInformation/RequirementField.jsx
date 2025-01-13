import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function RequirementField({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) {
  const [requirement, setRequirement] = useState("");
  const {editCourse, course} = useSelector((state)=> state.course);
  const [requirementList, setRequirementList] = useState([]);

  useEffect(()=>{
    if(editCourse){
      setRequirementList(course?.requirements);
    }
    register(name, {
        required:true,
        validate: (value) => value.length>0,
    })
  }, []);

  useEffect(()=> {
    setValue(name, requirementList);
  }, [requirementList]);

  useEffect(()=> {
    const value = getValues(name);
    console.log(value);
  }, [requirementList]);

  const handleAddRequirement = () => {
    if (requirement && requirementList.includes(requirement) === false) {
      setRequirementList([...requirementList, requirement]);
      // setValues({...getValues(), [name]: requirementList });
      setRequirement("");
    } else {
      toast.error("Requirement already exists.");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedList = [...requirementList];
    updatedList.splice(index, 1);
    setRequirementList(updatedList);
  };
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-richblack-5">
        {label}
        <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full form-style"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>
      {requirementList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {
            requirementList.map((req, index) => (
              <li key={index} className="flex item-center text-richblack-5">
                <span>{req}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  className=" ml-2 text-xs text-pure-greys-300"
                >
                  Remove
                </button>
              </li>
            ))
          }
        </ul>
      )}
      {
        errors[name] && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">{label} is required</span>
        )
      }
    </div>
  );
}

export default RequirementField;
