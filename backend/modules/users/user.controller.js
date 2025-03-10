let users = [];
let idCounter = 1;

const userSeeAll = (req, res) => res.json(users);
const userSeeOne = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};
const userCreate = (req, res) => {
    const newUser = { id: idCounter++, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
};
const userUpdate = (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "User not found" });
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
};
const userDelete = (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "User not found" });
    users.splice(index, 1);
    res.json({ message: "User deleted successfully" });
};

module.exports = { userSeeAll, userSeeOne, userCreate, userUpdate, userDelete };
