const database = require('../db/database');

async function createUser(userId) {
    const checkUserQuery = 'SELECT user_id FROM users WHERE user_id = ?';
    const createUserQuery = 'CALL create_new_user(?)';
    const values = [userId];
    
    try {
        const [existingUser] = await database.runQuery(checkUserQuery, values);
        if (!existingUser) {
            await database.runQuery(createUserQuery, values);
            console.log(`New user created: ${userId}`);
        } else {
            console.log(`User already exists: ${userId}`);
        }
        return true;
    } catch (error) {
        console.error('Error checking/creating user:', error);
        throw error;
    }
}

module.exports = { createUser };