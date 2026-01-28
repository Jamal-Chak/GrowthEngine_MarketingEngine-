const MissionService = require('../services/MissionService');

const createMissionFromTemplate = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { orgId, templateKey, customData } = req.body;

        const mission = await MissionService.createMissionFromTemplate(
            userId,
            orgId,
            templateKey,
            customData
        );

        res.status(201).json({ mission });
    } catch (error) {
        console.error('Create mission from template error:', error);
        res.status(500).json({ error: error.message });
    }
};

const createMission = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { orgId, missionData } = req.body;

        const mission = await MissionService.createMission(userId, orgId, missionData);

        res.status(201).json({ mission });
    } catch (error) {
        console.error('Create mission error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getMissions = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;
        const { completed, category } = req.query;

        const filters = {};
        if (completed !== undefined) filters.completed = completed === 'true';
        if (category) filters.category = category;

        const missions = await MissionService.getMissions(userId, filters);

        res.json({ missions });
    } catch (error) {
        console.error('Get missions error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getMissionById = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;
        const { missionId } = req.params;

        const mission = await MissionService.getMissionById(missionId, userId);

        res.json({ mission });
    } catch (error) {
        console.error('Get mission error:', error);
        res.status(404).json({ error: error.message });
    }
};

const completeStep = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { missionId } = req.params;
        const { stepIndex } = req.body;

        const result = await MissionService.completeStep(missionId, stepIndex, userId);

        res.json(result);
    } catch (error) {
        console.error('Complete step error:', error);
        res.status(500).json({ error: error.message });
    }
};

const completeMission = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { missionId } = req.params;

        const result = await MissionService.completeMission(missionId, userId);

        res.json(result);
    } catch (error) {
        console.error('Complete mission error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getMissionStats = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;

        const stats = await MissionService.getMissionStats(userId);

        res.json({ stats });
    } catch (error) {
        console.error('Get mission stats error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getTemplates = async (req, res) => {
    try {
        const templates = MissionService.getTemplates();

        res.json({ templates });
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMission,
    createMissionFromTemplate,
    getMissions,
    getMissionById,
    completeStep,
    completeMission,
    getMissionStats,
    getTemplates,
};
