import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { MdClose } from "react-icons/md"

function ChipInput({
    label,
    name,
    placeholder,
    register,
    errors,
    setValue,
    getValues
}) {

    const { editCourse, course } = useSelector((state) => state.course);
    const [chips, setChips] = useState([]);

    useEffect(() => {
        if (editCourse) {
            setChips(course?.tags);
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
    }, []);

    useEffect(() => {
        setValue(name, chips);
    }, [chips])

    // function to handle user input when chips are added
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            // prevent the default bahavior of the event
            event.preventDefault();
            // get the input value and remove any leading and trailing spaces
            const chipValue = event.target.value.trim();
            // check if the input value exists and is not already in the chips array
            if (chipValue && !chips.includes(chipValue)) {
                // add the chip to the chips array
                setChips([...chips, chipValue]);
                // clear the input field
                event.target.value = '';
            }
        }
    }

    // function to handle deletion of the chip
    const handleDeleteChip = (chipIndex) => {
        // create a new array excluding the chip
        const updatedChips = chips.filter((_, index) => index !== chipIndex);
        // update the chips state with the new array
        setChips(updatedChips);
    }


    return (
        <div>
            {/* Render the label for the input */}
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>
            {/* Render the chips and input */}
            <div className="flex w-full flex-wrap gap-y-2">
                {/* Map over the chips array and render each chip */}
                {chips.map((chip, index) => (
                    <div
                        key={index}
                        className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
                    >
                        {/* Render the chip value */}
                        {chip}
                        {/* Render the button to delete the chip */}
                        <button
                            type="button"
                            className="ml-2 focus:outline-none"
                            onClick={() => handleDeleteChip(index)}
                        >
                            <MdClose className="text-sm" />
                        </button>
                    </div>
                ))}
                {/* Render the input for adding new chips */}
                <input
                    id={name}
                    name={name}
                    type="text"
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className="form-style w-full"
                />
            </div>
            {/* Render an error message if the input is required and not filled */}
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    )
}

export default ChipInput