const User = require('../models/User');
const Organization = require('../models/Organization');
const generateToken = require('../utils/generateToken');

class AuthService {
    async register(email, password, orgName) {
        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new Error('User already exists');
        }

        const user = await User.create({
            email,
            passwordHash: password, // Will be hashed by pre-save hook
            role: 'owner',
        });

        const org = await Organization.create({
            name: orgName,
            members: [user._id],
        });

        if (user && org) {
            return {
                _id: user._id,
                email: user.email,
                role: user.role,
                orgId: org._id,
                token: generateToken(user._id),
            };
        } else {
            throw new Error('Invalid user data');
        }
    }

    async login(email, password) {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Find user's organization (assuming single org for now)
            const org = await Organization.findOne({ members: user._id });

            return {
                _id: user._id,
                email: user.email,
                role: user.role,
                orgId: org ? org._id : null,
                token: generateToken(user._id),
            };
        } else {
            throw new Error('Invalid email or password');
        }
    }
}

module.exports = new AuthService();
