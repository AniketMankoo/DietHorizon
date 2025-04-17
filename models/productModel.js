const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
            maxlength: [500, "Description cannot exceed 500 characters"],
            trim: true,
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },

        brand: {
            type: String,
            required: [true, "Brand name is required"],
            trim: true,
        },

        stock: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Stock cannot be negative"],
        },

        sold: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Sold count cannot be negative"],
        },

        tags: {
            type: [String],
            default: [],
            set: (tags) => tags.map((tag) => tag.toLowerCase().trim()),
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },

        images: {
            type: [String], // Assuming URLs of images
            default: [],
        },

        ratings: {
            type: Number,
            default: 0,
            min: [0, "Ratings cannot be negative"],
            max: [5, "Ratings cannot exceed 5"],
        },

        numOfRatings: {
            type: Number,
            default: 0,
            min: [0, "Number of ratings cannot be negative"],
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
