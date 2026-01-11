const Mission = require('../models/Mission');

class MissionService {
    async createMission(orgId, recommendationId, title, steps) {
        const mission = await Mission.create({
            orgId,
            recommendationId,
            title,
            steps: steps.map(step => ({ description: step })),
        });
        return mission;
    }

    async getMissions(orgId) {
        return await Mission.find({ orgId });
    }
}

module.exports = new MissionService();
