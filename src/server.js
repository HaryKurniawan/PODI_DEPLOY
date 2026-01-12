const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const familyDataRoutes = require('./routes/familyDataRoutes');
const adminRoutes = require('./routes/adminRoutes');
const posyanduRoutes = require('./routes/posyanduRoutes');
const kpspRoutes = require('./routes/kpspRoutes');
const growthRoutes = require('./routes/growthRoutes');
const dataChangeRoutes = require('./routes/dataChangeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const educationRoutes = require('./routes/educationRoutes');
const kbRoutes = require('./routes/kbRoutes');
const prisma = require('./config/prisma');
const { validateApiKey } = require('./middleware/apiKeyMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public route (tanpa API key)
app.get('/', (req, res) => {
  res.json({ message: 'Posyandu API is running' });
});

// Protected routes dengan API key
app.use('/api/auth', validateApiKey, authRoutes);
app.use('/api/family', validateApiKey, familyDataRoutes);
app.use('/api/admin', validateApiKey, adminRoutes);
app.use('/api/posyandu', validateApiKey, posyanduRoutes);
app.use('/api/kpsp', validateApiKey, kpspRoutes);
app.use('/api/growth', validateApiKey, growthRoutes);
app.use('/api/data-change', validateApiKey, dataChangeRoutes);
app.use('/api/notifications', validateApiKey, notificationRoutes);
app.use('/api/education', validateApiKey, educationRoutes);
app.use('/api/kb', validateApiKey, kbRoutes);

// Initialize notification scheduler
const { initScheduler } = require('./utils/notificationScheduler');

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Start notification scheduler
    initScheduler();
  });
}

module.exports = app;