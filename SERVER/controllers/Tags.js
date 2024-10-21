const Tags = require("../models/Tags")

exports.createTag = async (req, res) => {
    try{
        // fetch data
        const {name, description} = req.body;

        // validation
        if(!name || !description) {
            return res.status(500).json({
                success:false,
                message:error.message
            });
        }

        // create entry in DB
        const tagDetails = await Tags.create({
            name:name,
            description:description,
        })
        console.log(tagDetails);
        
        return res.status(200).json({
            success:true,
            message:"Tag Created Successfully!!"
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// getAllTags haldler function
exports.showAlltags = async (req, res) => {
    try{
        const allTags = await Tags.find({}, {name:true, description:true});
        return res.status(200).json({
            success:true,
            message:"All tags returned successfully!!",
            allTags,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}