const Category = require("../models/Category");

// create a new category

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "category is required"
      });
    }
    const categoryDetails = await Category.create({
      name,
      description
    })
    console.log(categoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};
// show all the categories

exports.showAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length == 0) {
      return res.status(400).json({
        success: false,
        message: "No categories found"
      })
    }
    return res.status(200).json({
      success: true,
      data: categories,
      message: "All categories fetched successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    // get courseID from req body
    const { categoryId } = req.body;

    // fatch all the courses for the selcted category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews"

      }).exec();

    // validations
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    if (selectedCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found in this category"
      });
    }

    // get different category course
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId }
    });

    let differntCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id).populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews"
        }).exec();

    // get all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })

      const allCourses = allCategories.flatMap((category) =>category.courses);
    
    // get top selling courses
    const mostSellingCourses = allCourses.sort((a, b)=> b.sold - a.sold).slice(0, 10);


    // return response
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differntCategory,
        mostSellingCourses
      }
    });

  }
  catch (error) {
    req.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}
