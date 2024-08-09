const { Interaction, Client, Collection, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-group')
        .setDescription('Crea un grupo de estudio')
        .addStringOption(option => option.setName('miembros').setDescription('Lista de miembros del grupo').setRequired(true)),
    async execute(interaction) {
        const membersString = interaction.options.getString('miembros');
        const membersArray = membersString.split(' ').map(name => name.replace(/[<@!>]/g, '')); // Filtra los IDs

        if (!interaction.client.groups) {
            interaction.client.groups = new Collection();
        }

        if (!membersArray.includes(interaction.user.id)) {
            membersArray.push(interaction.user.id);
        }

        interaction.client.groups.set(interaction.user.id, membersArray);
        await interaction.reply(`Grupo creado con los siguientes miembros: ${membersArray.map(id => `<@${id}>`).join(', ')}`);
    },
};
