const AuthService = require('../services/AuthService');

const registerUser = async (req, res) => {
    const { email, password, orgName } = req.body;

    console.log('[AUTH] Registration attempt:', { email, orgName });

    try {
        const user = await AuthService.register(email, password, orgName);
        console.log('[AUTH] Registration successful:', user._id);
        res.status(201).json(user);
    } catch (error) {
        console.error('[AUTH] Registration failed:', error.message);
        console.error('[AUTH] Stack:', error.stack);
        res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt for: ${email}`);

    try {
        const user = await AuthService.login(email, password);
        console.log(`[AUTH] Login successful for: ${email}`);
        res.json(user);
    } catch (error) {
        console.error(`[AUTH] Login failed for ${email}:`, error.message);
        res.status(401).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
