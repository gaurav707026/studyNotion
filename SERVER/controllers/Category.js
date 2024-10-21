const Category = require("../models/Category");

// create a new category

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// show all the categories

exports.showAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.categoryPageDetails = async (req, res)=>{
  try{
    // get courseID from req body
    const {categoryId} = req.body;

    // fatch all the courses for the selcted category
    const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

    // validations
    if(!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "No course not found"
      });
    }

    // get different category course
    const differntCategory  = await Category.find({
      _id: { $ne: categoryId }
    }).populate("courses").exec();

    // get top selling courses
    
    // return response
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differntCategory
      }
    });
    
  }
  catch(error){
    req.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}
