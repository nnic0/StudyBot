const db = require('../db/database');

async function createDeck(userId, topic) {
    const query = 'INSERT INTO topics (topic_name, user_id) VALUES (?, ?)';
    const values = [topic, userId];

    try {
        const result = await db.runQuery(query, values);
        return { success: true, message: `Mazo creado con éxito: ${topic}`, ephemeral: true };
    } catch (error) {
        console.error('Error al crear el mazo:', error);
        return { success: false, message: 'Hubo un error al crear el mazo.', ephemeral: true };
    }
}

async function deleteDeck(userId, topicId) {
    const query = 'DELETE FROM topics WHERE topic_id = ? AND user_id = ?';
    const values = [topicId, userId];

    try {
        const result = await db.runQuery(query, values);
        
        if (result.affectedRows === 0) {
            throw new Error('No se encontró el mazo o no pertenece al usuario');
        }

        return { success: true, message: `Mazo eliminado con éxito: ID ${topicId}`, ephemeral: true };
    } catch (error) {
        console.error('Error al eliminar el mazo:', error);
        return { success: false, message: 'Hubo un error al eliminar el mazo.', ephemeral: true };
    }
}

async function renameDeck(userId, topicId, topicName) {
    const query = 'UPDATE topics SET topic_name = ? WHERE topic_id = ? AND user_id = ?';
    const values = [topicName, topicId, userId];

    try {
        const result = await db.runQuery(query, values);

        if (result.affectedRows === 0) {
            throw new Error('No se encontró el mazo o no pertenece al usuario');
        }

        return { success: true, message: `Mazo renombrado con éxito: ${topicName}`, ephemeral: true };
    } catch (error) {
        console.error('Error al renombrar el mazo:', error);
        return { success: false, message: 'Hubo un error al renombrar el mazo.', ephemeral: true };
    }
}

async function getDecks(userId) {
    const query = `
        SELECT t.topic_id, t.topic_name, COUNT(c.card_id) AS card_count
        FROM topics t
        LEFT JOIN cards c ON t.topic_id = c.topic_id
        WHERE t.user_id = ?
        GROUP BY t.topic_id, t.topic_name
    `;    
    const values = [userId];

    try {
        const rows = await db.runQuery(query, values);

        if (rows.length === 0) {
            return { success: true, message: 'No se encontraron mazos.', data: [], ephemeral: true };
        }

        return rows;
    } catch (error) {
        console.error('Error al obtener los Mazo:', error);
        return { success: false, message: 'Hubo un error al obtener los Mazo.', ephemeral: true };
    }
}

module.exports = { 
    createDeck,
    deleteDeck,
    renameDeck,
    getDecks
};
