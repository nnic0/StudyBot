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

async function deleteTask(userId, task) {
    const query = 'DELETE FROM user_tasks WHERE user_id = ? AND task = ?';
    const values = [userId, task];
    try {
        const result = await database.runQuery(query, values);
        
        if (result.affectedRows === 0) {
            throw new Error('No se encontró la tarea o no pertenece al usuario');
        }

        return { success: true, message: `Tarea eliminada con éxito: ${task}`, ephemeral: true };
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        return { success: false, message: 'Hubo un error al eliminar la tarea.', ephemeral: true };
    }
}

async function addTask(userId, taskDescription) {
    const query = 'INSERT INTO user_tasks (user_id, task, task_done) VALUES (?, ?, ?)';
    const values = [userId, taskDescription, false];
    const result = await database.runQuery(query, values);
    return result;
}

async function completeTask(userId, task) {
    const query = 'UPDATE user_tasks SET task_done = 1, completed_at = NOW() WHERE task = ? AND user_id = ?';
    const values = [task, userId];

    try {
        const result = await database.runQuery(query, values);
        
        if (result.affectedRows === 0) {
            throw new Error('No se encontró la tarea o no pertenece al usuario');
        }

        return { success: true, message: `Tarea completada con éxito: ${task}`, ephemeral: true };
    } catch (error) {
        console.error('Error al completar la tarea:', error);
        return { success: false, message: 'Hubo un error al completar la tarea.', ephemeral: true };
    }
}

module.exports = { 
    getAllTasks,
    deleteTask,
    completeTask,
    addTask 
};