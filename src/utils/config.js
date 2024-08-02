const database = require('../db/database');

async function config(user_id) {
    try {
        const results = await database.runQuery('SELECT * FROM user_config WHERE user_id = ?', [user_id]);
        return results[0];
    } catch (error) {
        console.error('Error retrieving user config:', error);
        throw error;
    }
}

module.exports = { config };
