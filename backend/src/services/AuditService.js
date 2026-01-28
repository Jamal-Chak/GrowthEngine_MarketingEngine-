const Event = require('../models/Event');

class AuditService {
    /**
     * Log a critical action
     */
    async logAction(userId, action, details = {}, ipAddress = null) {
        try {
            await Event.create({
                userId,
                orgId: details.orgId || null,
                type: `AUDIT_${action}`,
                metadata: {
                    ...details,
                    ipAddress,
                    timestamp: new Date(),
                },
            });
        } catch (error) {
            console.error('Audit log failed:', error);
            // Don't throw - audit logging should not break the main flow
        }
    }

    /**
     * Log authentication events
     */
    async logAuth(userId, action, success, ipAddress, details = {}) {
        await this.logAction(userId, `AUTH_${action}`, {
            ...details,
            success,
            ipAddress,
        }, ipAddress);
    }

    /**
     * Log data changes
     */
    async logDataChange(userId, entityType, entityId, action, changes = {}) {
        await this.logAction(userId, `DATA_${action}`, {
            entityType,
            entityId,
            changes,
        });
    }

    /**
     * Log security events
     */
    async logSecurityEvent(userId, eventType, severity, details = {}) {
        await this.logAction(userId, `SECURITY_${eventType}`, {
            ...details,
            severity,
        });
    }

    /**
     * Get audit logs
     */
    async getLogsForUser(userId, options = {}) {
        const { limit = 100, startDate, endDate, actionTypes } = options;

        const query = { userId };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        if (actionTypes && actionTypes.length > 0) {
            query.type = { $in: actionTypes.map(t => `AUDIT_${t}`) };
        }

        return await Event.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }

    /**
     * Get security alerts
     */
    async getSecurityAlerts(options = {}) {
        const { limit = 50, severity } = options;

        const query = {
            type: /^AUDIT_SECURITY_/,
        };

        if (severity) {
            query['metadata.severity'] = severity;
        }

        return await Event.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }

    /**
     * Detect suspicious activity
     */
    async detectSuspiciousActivity(userId, timeWindowMs = 3600000) {
        const since = new Date(Date.now() - timeWindowMs);

        // Check for failed login attempts
        const failedLogins = await Event.countDocuments({
            userId,
            type: 'AUDIT_AUTH_LOGIN',
            'metadata.success': false,
            createdAt: { $gte: since },
        });

        // Check for rapid API calls
        const apiCalls = await Event.countDocuments({
            userId,
            createdAt: { $gte: since },
        });

        return {
            failedLogins,
            apiCalls,
            suspicious: failedLogins > 5 || apiCalls > 1000,
        };
    }
}

module.exports = new AuditService();
