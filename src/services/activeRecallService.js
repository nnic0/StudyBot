const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../db/database');
const { loadCards } = require('../services/cardService');
const { createButton, createActionRow } = require('../utils/buttonsHelper');
const { createEmbed } = require('../utils/embedHelper');
const colors = require('../utils/colors');
const moment = require('moment');

class ActiveRecall {
    constructor(interaction, topicId) {
        this.interaction = interaction;
        this.cards = [];
        this.topicId = topicId;
        this.currentCardIndex = 0;
        this.isStudying = false;
    }

    async start() {
        this.isStudying = true;
        this.cards = await loadCards(this.topicId);
        this.currentCardIndex = 0;
        await this.sendCard();
    }

    async sendCard() {
        if (!this.isStudying || this.currentCardIndex >= this.cards.length) {
            await this.stop();
            return;
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
            const response = await this.interaction.channel.awaitMessageComponent({ filter, time: 60000 });
    
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
            
            setTimeout(() => this.sendCard(), 5000);
        } catch (error) {
            if (error.name === 'TimeoutError') {
                await this.interaction.followUp('Se acabó el tiempo para responder. Sesión de estudio finalizada.');
                await this.stop();
            } else {
                console.error('Error en sendCard:', error);
                await this.interaction.followUp('Ocurrió un error. Sesión de estudio finalizada.');
                await this.stop();
            }
        }
    }
    
    
    async stop() {
        this.isStudying = false;
        await this.interaction.followUp('¡Sesión de estudio finalizada!');
    }
}

module.exports = { ActiveRecall };
