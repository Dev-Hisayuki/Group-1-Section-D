let auditLogs = [];

const auditLogger = (app) => {
  app.on('audit', (logEvent) => {
    const logEntry = {
      id: auditLogs.length + 1,
      ...logEvent,
      timestamp: new Date().toISOString()
    };
    auditLogs.push(logEntry);
    console.log('[AUDIT LOG]:', logEntry);
  });
};

module.exports = { auditLogger, auditLogs };
