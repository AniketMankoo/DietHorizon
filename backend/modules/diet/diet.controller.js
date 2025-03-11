let diets = [];
let idCounter = 1;

const dietSeeAll = (req, res) => {
    res.status(200).json(diets);
};

const dietSeeOne = (req, res) => {
    const diet = diets.find(d => d.id === parseInt(req.params.id));
    if (!diet) return res.status(404).json({ message: 'Diet not found' });

    res.status(200).json(diet);
};

const dietCreate = (req, res) => {
    const newDiet = { id: idCounter++, ...req.body };
    diets.push(newDiet);
    res.status(201).json(newDiet);
};

const dietUpdate = (req, res) => {
    const index = diets.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Diet not found' });

    diets[index] = { ...diets[index], ...req.body }; 
    res.status(200).json(diets[index]);
};

const dietDelete = (req, res) => {
    const index = diets.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Diet not found' });

    diets.splice(index, 1);
    res.status(200).json({ message: 'Diet deleted successfully' });
};

module.exports = { dietSeeAll, dietSeeOne, dietCreate, dietUpdate, dietDelete };
