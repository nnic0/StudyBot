const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../db/database');
const { loadCards } = require('../services/cardService');
const { createButton, createActionRow } = require('../utils/buttonsHelper');
const { createEmbed } = require('../utils/embedHelper');
const colors = require('../utils/colors');
const moment = require('moment');

class ActiveRecall {
    constructor(interaction, topicName) {
        this.interaction = interaction;
        this.cards = [];
        this.topicName = topicName;
        this.currentCardIndex = 0;
        this.isStudying = false;
        this.cardsStudied = 0;
        this.startTime = null;
    }

    async start() {
        this.isStudying = true;
        this.startTime = Date.now();
        const topic_id = await this.getId(this.topicName, this.interaction.user.id)
        this.cards = await loadCards(topic_id);
        this.currentCardIndex = 0;
        this.cardsStudied = 0;
        await this.sendCard();
    }

    async sendCard() {
        if (!this.isStudying) {
            await this.stop();
            return;
        }

        if (this.currentCardIndex >= this.cards.length) {
            this.currentCardIndex = 0;
        }
    
        const card = this.cards[this.currentCardIndex];
        const embed = createEmbed('📝 Tarjeta', card.question, colors.YELLOW);
    
        const actionRow = createActionRow([
            createButton('Again', 'again', 'Danger'),
            createButton('Hard', 'hard', 'Secondary'),
            createButton('Good', 'good', 'Primary'),
            createButton('Easy', 'easy', 'Success'),
            createButton('Stop', 'stop', 'Danger')
        ]);
    
        if (!this.interaction.replied && !this.interaction.deferred) {
            await this.interaction.reply({ embeds: [embed], components: [actionRow] });
        } else {
            await this.interaction.editReply({ embeds: [embed], components: [actionRow] });
        }
    
        const filter = i => ['again', 'hard', 'good', 'easy', 'stop'].includes(i.customId) && i.user.id === this.interaction.user.id;
        try {
            const response = await this.interaction.channel.awaitMessageComponent({ filter, time: 120000 });
    
            if (response.customId === 'stop') {
                await this.stop();
                return;
            }
    
            let easeFactor = card.ease;
            let interval = card.interval;
    
            switch (response.customId) {
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
    
            interval = Math.round(interval);
            const nextReview = moment().add(interval, 'days').toDate();
            await db.runQuery(
                'UPDATE cards SET last_review = NOW(), `interval` = ?, ease = ? WHERE card_id = ?',
                [interval, easeFactor, card.card_id]
            );
    
            await response.update({ embeds: [embed.setDescription(`${card.question}\n\n**Respuesta:** ${card.answer}`)], components: [] });
            this.currentCardIndex++;
            this.cardsStudied++;

            setTimeout(() => this.sendCard(), 5000);
        } catch (error) {
            if (error.name === 'TimeoutError') {
                await this.interaction.followUp('Se acabó el tiempo para responder. Sesión de estudio finalizada.');
                await this.stop();
            } else if (error.code == 'InteractionCollectorError'){ 
                await this.interaction.followUp('No se recibió respuesta. Sesión de estudio finalizada.');
                await this.stop();
            } else {
                console.error('Error en sendCard:', error);
                await this.interaction.followUp('Ocurrió un error. Sesión de estudio finalizada.');
                await this.stop();
            }
        }
    }
    
    async getId(topicName, userId) {
        const query = 'SELECT topic_id FROM topics WHERE topic_name = ? AND user_id = ?'
        const params = [topicName, userId]
        const [topic] = await db.runQuery(query, params);
        const topic_id = topic ? topic.topic_id : null;
        return topic_id
    }
    
    async stop() {
        this.isStudying = false;
        const duration = (Date.now() - this.startTime) / 1000; // Duración en segundos
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);

        this.updateUserStats(minutes);

        const statsEmbed = new EmbedBuilder()
            .setColor(colors.GREEN)
            .setTitle('Estadísticas de la sesión de estudio')
            .addFields(
                { name: 'Tarjetas estudiadas', value: `${this.cardsStudied}`, inline: true },
                { name: 'Duración', value: `${minutes} minutos, ${seconds} segundos`, inline: true },
                { name: 'Tema', value: this.topicName }
            );

        await this.interaction.followUp({ content: '¡Sesión de estudio finalizada!', embeds: [statsEmbed] });
    }

    async updateUserStats(minutes) {
        const userId = this.interaction.user.id;
        const query = 'UPDATE user_stats SET minutes_act = minutes_act + ?, cards_studied = cards_studied + ? WHERE user_id = ?'
        const params = [minutes, this.cardsStudied, userId]
        console.log(query, params)
        try {
            await db.runQuery(query, params);
        } catch (error) {
            console.error('Error al actualizar user_stats:', error);
            await this.interaction.followUp('Ocurrió un error al guardar las estadísticas.');
        }
    }
}

module.exports = { ActiveRecall };
