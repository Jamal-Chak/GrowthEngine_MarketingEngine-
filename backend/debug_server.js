try {
    console.log('Loading express...'); require('express');
    console.log('Loading dotenv...'); require('dotenv');
    console.log('Loading cors...'); require('cors');
    console.log('Loading helmet...'); require('helmet');
    console.log('Loading morgan...'); require('morgan');
    console.log('Loading config/database...'); require('./src/config/database');
    console.log('Loading routes/authRoutes...'); require('./src/routes/authRoutes');
    console.log('Loading routes/paymentRoutes...'); require('./src/routes/paymentRoutes');
    console.log('Success! All imports worked.');
} catch (e) {
    console.error('CRASHED:', e);
}
