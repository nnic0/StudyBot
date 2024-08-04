const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../db/database');
const colors = require('../utils/colors');

const activeTimers = new Map();

class Timer {
    constructor(interaction, workTime, relaxTime, members) {
        this.interaction = interaction;
        this.workTime = workTime;
        this.relaxTime = relaxTime;
        this.interval = null;
        this.members = new Set(members || [interaction.user.id]);
        this.totalMinutes = 0;
        this.completedSessions = 0;
        this.sessionStartTime = null;
        this.currentSessionMinutes = 0;
    }

    async start() {
        if (activeTimers.has(this.interaction.user.id)) {
            await this.interaction.reply({ content: 'Ya empezaste una sesión de Pomodoro.', ephemeral: true });
            return;
        }

        activeTimers.set(this.interaction.user.id, this);

        await this.interaction.deferReply();
        await this.interaction.editReply(`Pomodoro iniciado: ${this.workTime} minutos de trabajo y ${this.relaxTime} minutos de descanso.`);
        this.sessionStartTime = Date.now();
        this.startWorkSession();
    }

    async stop() {
        this.updateCurrentSessionTime();
        clearTimeout(this.interval);
        activeTimers.delete(this.interaction.user.id);
        await this.notifyGroup('La sesión de Pomodoro se detuvo con éxito.');
        await this.updateGroupStats();
    }

    async startWorkSession() {
        await this.sendEmbed('trabajo', this.workTime);
        this.sessionStartTime = Date.now();
        this.interval = setTimeout(() => {
            this.endWorkSession();
        }, this.workTime * 60 * 1000);
    }

    async endWorkSession() {
        this.updateCurrentSessionTime();
        this.completedSessions++;
        this.startRelaxSession();
    }

    updateCurrentSessionTime() {
        const now = Date.now();
        const elapsedMinutes = (now - this.sessionStartTime) / (60 * 1000);
        this.currentSessionMinutes += elapsedMinutes;
        this.sessionStartTime = now;
    }

    async startRelaxSession() {
        await this.sendEmbed('descanso', this.relaxTime);
        this.interval = setTimeout(async () => {
            this.totalMinutes += this.workTime;
            await this.askToEndSession();
        }, this.relaxTime * 60 * 1000);
    }

    async askToEndSession() {
        const embed = new EmbedBuilder()
            .setTitle('¡Suficiente descanso! ¿Continuamos?')
            .setDescription('¿Quieres empezar otra sesión de trabajo?');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('continue')
                    .setLabel('Sí')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger),
            );

        const message = await this.interaction.channel.send({ embeds: [embed], components: [row], fetchReply: true });

        const filter = i => ['continue', 'stop'].includes(i.customId) && this.members.has(i.user.id);

        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'continue') {
                await i.update({ content: 'Empezando otra sesión de trabajo...', components: [] });
                this.startWorkSession();
            } else {
                await i.update({ content: 'Terminando la sesión de Pomodoro. ¡Buen trabajo!', components: [] });
                this.endSession();
            }
        });

        collector.on('end', collected => {
            if (!collected.size) {
                this.interaction.channel.send({ content: 'No hubo respuesta. Terminando la sesión de Pomodoro.', components: [] });
                this.endSession();
            }
        });
    }

    async sendEmbed(sessionType, time) {
        const embed = new EmbedBuilder()
            .setTitle(`Sesión de ${sessionType}`)
            .setDescription(`${time} minutos de ${sessionType.toLowerCase()}.`)
            .setColor(sessionType === 'trabajo' ? colors.RED : colors.GREEN)
            .setTimestamp();

        await this.notifyGroup({ embeds: [embed] });
    }

    async notifyGroup(message) {
        const mentions = Array.from(this.members).map(id => `<@${id}>`).join(' ');
        const content = typeof message === 'string' ? `${mentions} ${message}` : { ...message, content: `${mentions} ${message.content || ''}` };

        await this.interaction.channel.send(content).catch(console.error);
    }

    async endSession() {
        this.updateCurrentSessionTime();
        clearTimeout(this.interval);
        activeTimers.delete(this.interaction.user.id);
        await this.notifyGroup('La sesión de Pomodoro ha terminado. ¡Buen trabajo!');
        await this.updateGroupStats();
    }

    async updateGroupStats() {
        const minutes = Math.round(this.currentSessionMinutes);
        const sessions = this.completedSessions;

        for (const userId of this.members) {
            await this.updateStats(userId, minutes, sessions);
        }

        this.currentSessionMinutes = 0;
        this.completedSessions = 0;
    }

    async updateStats(userId, minutes, sessions) {
        try {
            const queryUpdate = 'UPDATE user_stats SET minutes = minutes + ?, pomodoro_tot = pomodoro_tot + ? WHERE user_id = ?';
            await db.runQuery(queryUpdate, [minutes, sessions, userId]);
        } catch (error) {
            console.error(`Error updating stats for user ${userId}:`, error);
        }
    }
}

module.exports = { Timer, activeTimers };
