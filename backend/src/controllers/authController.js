const AuthService = require('../services/AuthService');

const registerUser = async (req, res) => {
    const { email, password, orgName } = req.body;

    try {
        const user = await AuthService.register(email, password, orgName);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await AuthService.login(email, password);
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
