const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            minlength: [3, "Category name must be at least 3 characters"],
            maxlength: [50, "Category name cannot exceed 50 characters"],
        },

        description: {
            type: String,
            required: [true, "Category description is required"],
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
