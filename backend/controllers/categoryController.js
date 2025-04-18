const Category = require("../models/categoryModel");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const errorMessages = require("../utils/errorMessages");

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort('name');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(errorMessages.CATEGORY_NOT_FOUND || "Category not found", 404));
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, parentCategory } = req.body;

  if (!name) {
    return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS || "Category name is required", 400));
  }

  // Check if category with the same name already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(new ErrorResponse("Category with this name already exists", 400));
  }

  const category = await Category.create({
    name,
    description,
    parentCategory
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res, next) => {
  const { name, description, parentCategory } = req.body;

  // Create an object with provided fields only
  const updateFields = {};
  if (name) updateFields.name = name;
  if (description !== undefined) updateFields.description = description;
  if (parentCategory !== undefined) updateFields.parentCategory = parentCategory;

  if (Object.keys(updateFields).length === 0) {
    return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS || "Please provide fields to update", 400));
  }

  // Check if category exists
  let category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorResponse(errorMessages.CATEGORY_NOT_FOUND || "Category not found", 404));
  }

  // If name is being updated, check for duplicates
  if (name && name !== category.name) {
    const nameExists = await Category.findOne({ name });
    if (nameExists) {
      return next(new ErrorResponse("Category with this name already exists", 400));
    }
  }

  // Update category
  category = await Category.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse(errorMessages.CATEGORY_NOT_FOUND || "Category not found", 404));
  }

  // In a production app, you might want to:
  // 1. Check if category has products attached
  // 2. Either prevent deletion or reassign products
  // 3. Handle sub-categories if this is a parent

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: {}
  });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
