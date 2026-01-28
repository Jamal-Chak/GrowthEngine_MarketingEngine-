const express = require('express');
const router = express.Router();
const {
    createMission,
    createMissionFromTemplate,
    getMissions,
    getMissionById,
    completeStep,
    completeMission,
    getMissionStats,
    getTemplates,
} = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');

// Templates
router.get('/templates', getTemplates);

// Mission CRUD
router.post('/', protect, createMission);
router.post('/from-template', protect, createMissionFromTemplate);
router.get('/', protect, getMissions);
router.get('/stats', protect, getMissionStats);
router.get('/:missionId', protect, getMissionById);

// Mission completion
router.post('/:missionId/complete-step', protect, completeStep);
router.post('/:missionId/complete', protect, completeMission);

module.exports = router;
