const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const db = require('../db/database');
const moment = require('moment');

class Cards {
    constructor(interaction, topic_id, topic_name) {
        this.interaction = interaction;
        this.cards = [];
        this.topic_id = topic_id;
        this.topic_name = topic_name;
        this.currentCardIndex = 0;
        this.isStudying = false;
    }

    async start(topicId) {
        this.isStudying = true;
        await this.loadCards(topicId);
        this.currentCardIndex = 0;
        await this.sendCard();
    }

    async loadCards(topicId) {
        const [rows] = await db.runQuery(
            'SELECT * FROM cards WHERE topic_id = ? AND next_review <= NOW() ORDER BY next_review ASC', 
            [topicId]
        );
        this.cards = rows;
    }

    async createCard(topicId, question, answer, userId) {
        await db.runQuery(
            'INSERT INTO cards (topic_id, question, answer, user_id) VALUES (?, ?, ?, ?)', 
            [topicId, question, answer, userId]
        );
    }

    async deleteCard(userId, topic_name, card_id){
        await db.runQuery(
            'DELETE FROM cards WHERE card_id = ? AND topic_name = ? AND user_id = ?',
            [card_id, topic_name, userId]
        );
    }

    async renameDeck(userId, topic_id, topic_name){
        await db.runQuery(
            'UPDATE topics SET topic_name = ? WHERE user_id = ?',
            [topic_id, topic_name, userId]
        );
    }
    
    async createDeck(userId, topic){
        await db.runQuery(
            'INSERT INTO topics (topic_name, user_id) VALUES (?, ?)',
            [topic, userId]
        );
    }

    async deleteDeck(userId, topic){
        await db.runQuery(
            'DELETE FROM topics WHERE topic_id = ? AND user_id = ?',
            [topic, userId]
        );
    }

    async sendCard() {
        if (!this.isStudying || this.currentCardIndex >= this.cards.length) {
            await this.stop();
            return;
        }

        const card = this.cards[this.currentCardIndex];
        const embed = new MessageEmbed()
            .setTitle('Tarjeta de Memoria')
            .setDescription(card.question)
            .setColor('#0099ff');

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('again').setLabel('Again').setStyle('DANGER'),
                new MessageButton().setCustomId('hard').setLabel('Hard').setStyle('SECONDARY'),
                new MessageButton().setCustomId('good').setLabel('Good').setStyle('PRIMARY'),
                new MessageButton().setCustomId('easy').setLabel('Easy').setStyle('SUCCESS')
            );

        await this.interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => ['again', 'hard', 'good', 'easy'].includes(i.customId) && i.user.id === this.interaction.user.id;
        const collector = this.interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            let easeFactor = card.ease;
            let interval = card.interval;

            switch (i.customId) {
                case 'again':
                    easeFactor *= 0.8;
                    interval = 1;
                    break;
                case 'hard':
                    easeFactor *= 0.9;
                    interval *= 1.2;
                    break;
                case 'good':
                    interval *= easeFactor;
                    break;
                case 'easy':
                    easeFactor *= 1.2;
                    interval *= 1.5;
                    break;
            }

            const nextReview = moment().add(interval, 'days').toDate();
            await db.runQuery(
                'UPDATE cards SET last_review = NOW(), next_review = ?, interval = ?, ease = ? WHERE card_id = ?',
                [nextReview, interval, easeFactor, card.card_id]
            );

            await i.update({ embeds: [embed.setDescription(`${card.question}\n\n**Respuesta:** ${card.answer}`)], components: [] });
            this.currentCardIndex++;
            setTimeout(() => this.sendCard(), 5000);
        });

        collector.on('end', collected => {
            if (this.isStudying) {
                this.stop();
            }
        });
    }

    async stop() {
        this.isStudying = false;
        await this.interaction.reply('¡Sesión de estudio finalizada!');
    }
}

module.exports = Cards;
