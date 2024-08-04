const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


function createButton(label, customId, style) {
    return new ButtonBuilder()
        .setLabel(label)
        .setCustomId(customId)
        .setStyle(ButtonStyle[style]);
}

function createActionRow(buttons) {
    return new ActionRowBuilder().addComponents(buttons);
}

module.exports = { createButton, createActionRow };
