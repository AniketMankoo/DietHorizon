const validateDiet = (req, res, next) => {
    const { name, calories, proteins, fats, carbs } = req.body;

    if (!name || typeof name !== "string") {
        return res.status(400).json({ message: "Invalid or missing 'name'" });
    }
    if (!calories || typeof calories !== "number" || calories < 0) {
        return res.status(400).json({ message: "Invalid or missing 'calories'" });
    }
    if (!proteins || typeof proteins !== "number" || proteins < 0) {
        return res.status(400).json({ message: "Invalid or missing 'proteins'" });
    }
    if (!fats || typeof fats !== "number" || fats < 0) {
        return res.status(400).json({ message: "Invalid or missing 'fats'" });
    }
    if (!carbs || typeof carbs !== "number" || carbs < 0) {
        return res.status(400).json({ message: "Invalid or missing 'carbs'" });
    }

    next(); // Proceed to the controller
};

module.exports = { validateDiet };
0