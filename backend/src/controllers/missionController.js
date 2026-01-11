const MissionService = require('../services/MissionService');

const createMission = async (req, res) => {
    const { orgId, recommendationId, title, steps } = req.body;
    try {
        const mission = await MissionService.createMission(orgId, recommendationId, title, steps);
        res.status(201).json(mission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMissions = async (req, res) => {
    const { orgId } = req.query;
    try {
        const missions = await MissionService.getMissions(orgId);
        res.json(missions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createMission, getMissions };
