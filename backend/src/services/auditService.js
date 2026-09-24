const AuditLog = require('../models/AuditLog');

const logAudit = async ({ userId = null, action, metadata = {}, ipAddress = '', userAgent = '', status = 'SUCCESS' }) => {
  try {
    await AuditLog.create({
      userId,
      action,
      metadata,
      ipAddress,
      userAgent,
      status,
    });
  } catch (err) {
    console.error('[AuditLog Error]', err.message);
  }
};

module.exports = { logAudit };
