const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Meal name is required'],
        trim: true
    },
    time: {
        type: String,
        required: [true, 'Meal time is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Meal description is required']
    },
    calories: {
        type: Number,
        required: [true, 'Calorie count is required']
    },
    proteins: {
        type: Number,
        default: 0
    },
    carbs: {
        type: Number,
        default: 0
    },
    fats: {
        type: Number,
        default: 0
    }
});

const dietPlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Diet plan title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Trainer ID is required']
    },
    duration: {
        type: Number,
        default: 7, // Default duration in days
        min: [1, 'Duration must be at least 1 day']
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    },
    meals: [mealSchema],
    dailyCalories: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate total daily calories virtual
dietPlanSchema.virtual('totalDailyCalories').get(function () {
    return this.meals.reduce((total, meal) => total + meal.calories, 0);
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
