const db = require('../db');

const AuditModel = {
  createLog: async (userId, action, description) => {
    const query = 'INSERT INTO audit_logs (user_id, action, description) VALUES (?, ?, ?)';
    return db.query(query, [userId, action, description]);
  },

  getAllLogsWithUsers: async () => {
    const query = `
      SELECT audit_logs.id, users.username, audit_logs.action, audit_logs.description, audit_logs.created_at
      FROM audit_logs
      INNER JOIN users ON audit_logs.user_id = users.id
      ORDER BY audit_logs.created_at DESC
    `;
    return db.query(query);
  }
};

module.exports = AuditModel;
nano controllers/auditController.js

