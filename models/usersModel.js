const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter a Name"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [25, "Name can't be longer than 25 characters"],
        },

        email: {
            type: String,
            required: [true, "Please Enter an Email"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Minimum 8 characters is required"],
            select: false,
        },

        role: {
            type: String,
            enum: ["Customer", "Admin"],
            default: "Customer",
            required: true,
            trim: true,
        },

        countryCode: {
            type: String,
            enum: ["+91"],
            required: true,
        },

        phone: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return /^\d{10}$/.test(value);
                },
                message: "Invalid Phone Number. It must be a 10-digit number.",
            },
        },

        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true, default: "India" },
            postalCode: {
                type: String,
                required: true,
                match: [/^\d{6}$/, "Invalid postal code. It must be a 6-digit PIN code."],
            },
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
