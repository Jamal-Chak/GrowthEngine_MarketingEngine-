const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database (non-blocking - don't await)
connectDB().catch(err => console.error('DB connection failed:', err));

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const missionRoutes = require('./routes/missionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/payments', require('./routes/paymentRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✓ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api`);
});
