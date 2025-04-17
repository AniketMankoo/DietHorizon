const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Category = require("../models/categoryModel");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const errorMessages = require("../utils/errorMessages");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
});

exports.assignUserRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: "User role updated", data: user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));

    res.status(200).json({ success: true, message: "User deleted successfully" });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, brand, stock, category, tags } = req.body;

    if (!name || !description || !price || !brand || !stock || !category) {
        return next(new ErrorResponse("All required fields must be filled!", 400));
    }

    const productExists = await Product.findOne({ name });
    if (productExists) return next(new ErrorResponse("Product with this name already exists!", 400));

    const product = await Product.create({
        name,
        description,
        price,
        brand,
        stock: stock < 0 ? 0 : stock,
        category,
        tags: tags ? tags.map(tag => tag.toLowerCase().trim()) : []
    });

    res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND, 404));

    const { name, description, price, brand, stock, sold, category, tags } = req.body;

    if (price !== undefined && price < 0) return next(new ErrorResponse("Price cannot be negative!", 400));
    if (stock !== undefined && stock < 0) return next(new ErrorResponse("Stock cannot be negative!", 400));
    if (sold !== undefined && sold < 0) return next(new ErrorResponse("Sold count cannot be negative!", 400));

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.brand = brand || product.brand;
    product.stock = stock !== undefined ? stock : product.stock;
    product.sold = sold !== undefined ? sold : product.sold;
    product.category = category || product.category;
    product.tags = tags ? tags.map(tag => tag.toLowerCase().trim()) : product.tags;

    const updatedProduct = await product.save();
    res.status(200).json({ success: true, data: updatedProduct });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorResponse(errorMessages.PRODUCT_NOT_FOUND, 404));

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted successfully" });
});

exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json({ success: true, data: orders });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));

    order.status = req.body.status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", data: order });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));

    res.status(200).json({ success: true, message: "Order canceled successfully" });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    if (!name) return next(new ErrorResponse("Category name is required", 400));

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) return next(new ErrorResponse("Category already exists", 400));

    const category = await Category.create({ name });
    res.status(201).json({ success: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return next(new ErrorResponse(errorMessages.CATEGORY_NOT_FOUND, 404));

    res.status(200).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new ErrorResponse(errorMessages.CATEGORY_NOT_FOUND, 404));

    res.status(200).json({ success: true, message: "Category deleted" });
});
