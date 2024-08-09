const database = require('../db/database');

async function createUser(userId) {
    const checkUserQuery = 'SELECT user_id FROM users WHERE user_id = ?';
    const createUserQuery = 'CALL create_new_user(?)';
    const values = [userId];

    try {
        const [existingUser] = await database.runQuery(checkUserQuery, values);
        if (!existingUser.length) {
            await database.runQuery(createUserQuery, values);
        } 
        return true;
    } catch (error) {
        console.error('Error checking/creating user:', error);
        throw error;
    }
}

async function getStats(userId) {
    const query = 'SELECT user_id, minutes_pom, pomodoro_tot, minutes_act, cards_studied FROM user_stats WHERE user_id = ?';
    const params = [userId];

    try {
        const result = await database.runQuery(query, params);
        return result || null;
    } catch (error) {
        console.error('No se pudo obtener las estadísticas: ', error);
        throw error;
    }
}

async function getTasks(userId) {
    const query = `
        SELECT 
            COUNT(task_id) AS total_tasks,
            SUM(task_done) AS tasks_completed,
            AVG(TIMESTAMPDIFF(MINUTE, created_at, completed_at)) AS avg_completion_time 
        FROM 
            user_tasks 
        WHERE 
            user_id = ?`;

    try {
        const tasks = await database.runQuery(query, [userId]);
        return tasks || null;
    } catch (error) {
        console.error('No se pudo obtener las tareas: ', error);
        throw error;
    }
}

async function getTopicsAndCards(userId) {
    const topicsQuery = `
        SELECT 
            t.topic_id, 
            t.topic_name, 
            COUNT(c.card_id) AS total_cards 
        FROM 
            topics t 
        LEFT JOIN 
            cards c ON t.topic_id = c.topic_id 
        WHERE 
            t.user_id = ?
        GROUP BY 
            t.topic_id, t.topic_name`;

    const cardsQuery = `
        SELECT 
            t.topic_id, 
            t.topic_name, 
            c.card_id, 
            c.question, 
            c.answer, 
            c.last_review, 
            c.next_review 
        FROM 
            topics t 
        JOIN 
            cards c ON t.topic_id = c.topic_id 
        WHERE 
            t.user_id = ?`;

    try {
        const topics = await database.runQuery(topicsQuery, [userId]);
        const cards = await database.runQuery(cardsQuery, [userId]);
        return { topics, cards };
    } catch (error) {
        console.error('No se pudo obtener los temas y tarjetas: ', error);
        throw error;
    }
}

async function getUserProfile(userId) {
    try {
        const stats = await getStats(userId);
        const tasks = await getTasks(userId);
        const { topics, cards } = await getTopicsAndCards(userId);

        return {
            stats,
            tasks,
            topics,
            cards
        };
    } catch (error) {
        console.error('No se pudo obtener el perfil del usuario: ', error);
        throw error;
    }
}

module.exports = { 
    createUser,
    getStats,
    getTasks,
    getTopicsAndCards,
    getUserProfile
};
