exports.signup = (req, res) => {
    const { name, email, password } = req.body;
    res.status(201).json({ message: "User registered!", user: { name, email } });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    res.status(200).json({ message: "User logged in!", email });
};
