// controllers/productController.js
const Product = require("../models/productModel");
const ErrorResponse = require("../utils/errorResponse");
const errorMessages = require("../utils/errorMessages");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  // Add pagination, filtering, and sorting support
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Create query object
  let query = {};
  
  // Filter by price range
  if (req.query.minPrice && req.query.maxPrice) {
    query.price = { 
      $gte: parseFloat(req.query.minPrice), 
      $lte: parseFloat(req.query.maxPrice) 
    };
  } else if (req.query.minPrice) {
    query.price = { $gte: parseFloat(req.query.minPrice) };
  } else if (req.query.maxPrice) {
    query.price = { $lte: parseFloat(req.query.maxPrice) };
  }
  
  // Filter by brand
  if (req.query.brand) {
    query.brand = req.query.brand;
  }
  
  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Filter by in-stock status
  if (req.query.inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  // Count total matching documents for pagination info
  const total = await Product.countDocuments(query);
  
  // Execute query with pagination
  const products = await Product.find(query)
    .skip(startIndex)
    .limit(limit)
    .sort(req.query.sort ? { [req.query.sort]: req.query.order || 'asc' } : { createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: products.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: products
  });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND, 404));
  }
  
  // Increment product views count
  product.viewCount = (product.viewCount || 0) + 1;
  await product.save();
  
  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Create new product - Admin only
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Validate required fields
  const { name, price, stock } = req.body;
  
  if (!name || !price) {
    return next(new ErrorResponse("Name and price are required", 400));
  }
  
  // Add user ID to req.body
  req.body.user = req.user.id;
  
  // Set default values if not provided
  if (stock === undefined) req.body.stock = 0;
  
  const product = await Product.create(req.body);
  
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
});

/**
 * @desc    Update product - Admin only
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND, 404));
  }
  
  // Prevent negative stock values
  if (req.body.stock && req.body.stock < 0) {
    req.body.stock = 0;
  }
  
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});

/**
 * @desc    Delete product - Admin only
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND, 404));
  }
  
  await product.deleteOne();
  
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: {}
  });
});

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { query } = req.query;
  
  if (!query) {
    return next(new ErrorResponse("Please provide a search query", 400));
  }
  
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { brand: { $regex: query, $options: 'i' } }
    ]
  });
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:categoryId
 * @access  Public
 */
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  
  // Add pagination support
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Count total for pagination
  const total = await Product.countDocuments({ category: categoryId });
  
  const products = await Product.find({ category: categoryId })
    .skip(startIndex)
    .limit(limit)
    .sort(req.query.sort ? { [req.query.sort]: req.query.order || 'asc' } : { createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: products.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: products
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  
  const products = await Product.find({ featured: true })
    .limit(limit)
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * @desc    Get related products
 * @route   GET /api/products/:id/related
 * @access  Public
 */
exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND, 404));
  }
  
  const limit = parseInt(req.query.limit, 10) || 4;
  
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category
  })
    .limit(limit)
    .sort({ viewCount: -1 });
  
  res.status(200).json({
    success: true,
    count: relatedProducts.length,
    data: relatedProducts
  });
});

module.exports = {
  getAllProducts: exports.getAllProducts,
  getProductById: exports.getProductById,
  createProduct: exports.createProduct,
  updateProduct: exports.updateProduct,
  deleteProduct: exports.deleteProduct,
  searchProducts: exports.searchProducts,
  getProductsByCategory: exports.getProductsByCategory,
  getFeaturedProducts: exports.getFeaturedProducts,
  getRelatedProducts: exports.getRelatedProducts
};