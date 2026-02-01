const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        // Only initialize if credentials exist to prevent startup crashes
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            console.log('[EmailService] Transporter initialized');
        } else {
            console.warn('[EmailService] SMTP credentials missing. Email sending disabled.');
        }
    }

    async sendEmail({ to, subject, html, text }) {
        if (!this.transporter) {
            console.log('[EmailService] Mock Send (No Transporter):', { to, subject });
            return { success: false, message: 'SMTP not configured' };
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"GrowthEngine" <noreply@growthengine.com>',
                to,
                subject,
                text,
                html,
            });

            console.log('[EmailService] Message sent: %s', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('[EmailService] Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWeeklySummary(user, stats) {
        const subject = `Your Weekly Growth Report: ${stats.points} XP Gained!`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4F46E5;">Weekly Growth Summary</h1>
                <p>Hi ${user.name || 'Founder'},</p>
                <p>Here's how you performed this week:</p>
                
                <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="margin-top: 0;">${stats.points} XP</h2>
                    <p>Current Streak: ${stats.streak_days} days 🔥</p>
                    <p>Missions Completed: ${stats.completed_missions}</p>
                </div>

                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
                   style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                    View Dashboard
                </a>
            </div>
        `;

        return this.sendEmail({
            to: user.email,
            subject,
            html,
            text: `You gained ${stats.points} XP this week! Login to view your dashboard.`,
        });
    }
}

module.exports = new EmailService();
