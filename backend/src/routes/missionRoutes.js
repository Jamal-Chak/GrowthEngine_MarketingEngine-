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
router.get('/', getMissions);
router.get('/stats', getMissionStats);
router.get('/:missionId', getMissionById);

// Mission completion
router.post('/:missionId/complete-step', protect, completeStep);
router.post('/:missionId/complete', protect, completeMission);

module.exports = router;
