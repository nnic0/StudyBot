const db = require('../db/database');

async function createCard(topicId, question, answer, userId) {
    const query = 'INSERT INTO cards (topic_id, question, answer, user_id) VALUES (?, ?, ?, ?)';
    const values = [topicId, question, answer, userId];

    try {
        await db.runQuery(query, values);
        return { success: true, message: 'Tarjeta creada con éxito.' };
    } catch (error) {
        console.error('Error al crear la tarjeta:', error);
        return { success: false, message: 'Hubo un error al crear la tarjeta.' };
    }
}

async function deleteCard(userId, cardId) {
    const query = 'DELETE FROM cards WHERE card_id = ? AND user_id = ?';
    const values = [cardId, userId];

    try {
        const result = await db.runQuery(query, values);
        if (result.affectedRows === 0) {
            throw new Error('No se encontró la tarjeta o no pertenece al usuario.');
        }
        return { success: true, message: 'Tarjeta eliminada con éxito.' };
    } catch (error) {
        console.error('Error al eliminar la tarjeta:', error);
        return { success: false, message: 'Hubo un error al eliminar la tarjeta.' };
    }
}

async function loadCards(topicId) {
    const query = 'SELECT * FROM cards WHERE topic_id = ? AND next_review <= NOW() ORDER BY next_review ASC';
    const values = [topicId];

    try {
        const rows = await db.runQuery(query, values);
        if (rows.length === 0) {
            return { success: true, message: 'No hay tarjetas para revisar.', data: [] };
        }
        return rows
    } catch (error) {
        console.error('Error al cargar las tarjetas:', error);
        return { success: false, message: 'Hubo un error al cargar las tarjetas.' };
    }
}

module.exports = {
    createCard,
    deleteCard,
    loadCards
};
