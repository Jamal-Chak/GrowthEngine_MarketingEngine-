const OpenAI = require('openai');

class AIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'mock-key',
        });
    }

    async generateMarketingStrategy(context) {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('Missing OPENAI_API_KEY. Returning mock AI response.');
            return this._getMockResponse(context);
        }

        try {
            const prompt = `
                You are a world-class Growth Marketing Expert.
                Generate a specific, actionable marketing mission for a user with the following context:
                - Business Type: ${context.businessType}
                - Goal: ${context.goal}
                - Primary Channel: ${context.channel}
                
                The output MUST be a valid JSON object with this structure:
                {
                    "title": "Actionable Title",
                    "description": "Short description",
                    "whyMatters": "Why this specific action drives growth",
                    "steps": [
                        { "description": "Step 1", "xpReward": 20 },
                        { "description": "Step 2", "xpReward": 30 },
                        { "description": "Step 3", "xpReward": 50 }
                    ],
                    "estimatedTime": "15 minutes",
                    "impactLevel": "high"
                }
            `;

            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'system', content: prompt }],
                model: 'gpt-4o',
                response_format: { type: 'json_object' },
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('OpenAI API Error:', error.message);
            // Fallback to mock if API fails (e.g., 429 quota exceeded, 401 invalid key)
            console.warn('Falling back to Mock AI Strategy due to API error.');
            return this._getMockResponse(context);
        }
    }

    _getMockResponse(context) {
        return {
            title: `Master ${context.channel || 'Growth'} Strategy`,
            description: `A custom AI-generated plan to boost your ${context.goal || 'growth'} using ${context.channel || 'proven tactics'}.`,
            whyMatters: "This strategy is tailored to your specific business model and current growth stage.",
            steps: [
                { description: "Analyze three competitors in your niche", xpReward: 30 },
                { description: `Draft 5 posts for ${context.channel || 'social media'}`, xpReward: 50 },
                { description: "Set up a tracking link for attribution", xpReward: 20 }
            ],
            estimatedTime: "30 minutes",
            impactLevel: "high"
        };
    }
}

module.exports = new AIService();
