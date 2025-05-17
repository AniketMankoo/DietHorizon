const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Exercise name is required'],
        trim: true
    },
    sets: {
        type: Number,
        required: [true, 'Number of sets is required'],
        min: [1, 'Must have at least 1 set']
    },
    reps: {
        type: String,
        required: [true, 'Reps information is required']
    },
    duration: {
        type: String
    },
    rest: {
        type: String
    },
    description: {
        type: String
    },
    day: {
        type: Number,
        required: [true, 'Day assignment is required'],
        min: [1, 'Day must be at least 1']
    }
});

const workoutPlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Workout plan title is required'],
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
    exercises: [exerciseSchema],
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add a virtual to get exercises grouped by day
workoutPlanSchema.virtual('exercisesByDay').get(function () {
    const grouped = {};

    this.exercises.forEach(exercise => {
        if (!grouped[exercise.day]) {
            grouped[exercise.day] = [];
        }
        grouped[exercise.day].push(exercise);
    });

    return grouped;
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
