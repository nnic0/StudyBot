const database = require('../db/database');

async function getAllTasks(userId) {
    const query = 'SELECT * FROM user_tasks WHERE user_id = ? ORDER BY created_at ASC';
    const values = [userId];
    try {
        const results = await database.runQuery(query, values);
        return results;
    } catch (error) {
        console.error('Error getting tasks:', error);
        throw error;
    }
}

async function addTask(userId, taskDescription) {
    const query = 'INSERT INTO user_tasks (user_id, task, task_done) VALUES (?, ?, ?)';
    const values = [userId, taskDescription, false];
    const result = await database.runQuery(query, values);
    return result;
}

async function completeTask(userId, taskId) {
    const query = 'UPDATE user_tasks SET task_done = 1, completed_at = NOW() WHERE task_id = ? AND user_id = ?';
    const values = [taskId, userId];

    try {
        const result = await database.runQuery(query, values);
        
        if (result.affectedRows === 0) {
            throw new Error('No se encontró la tarea o no pertenece al usuario');
        }

        return { success: true, message: `Tarea completada con éxito: ID ${taskId}`, ephemeral: true };
    } catch (error) {
        console.error('Error al completar la tarea:', error);
        return { success: false, message: 'Hubo un error al completar la tarea.', ephemeral: true };
    }
}

module.exports = { 
    getAllTasks,
    completeTask,
    addTask 
};