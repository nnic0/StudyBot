const { Interaction, Client, Collection, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('group-disband')
        .setDescription('Disuelve tu grupo de estudio'),
    async execute(interaction) {
        if (!interaction.client.groups) {
            interaction.client.groups = new Collection();
        }

        const group = interaction.client.groups.get(interaction.user.id);

        if (!group) {
            return interaction.reply({ content: 'No tienes ningún grupo creado.', ephemeral: true});
        }

        interaction.client.groups.delete(interaction.user.id);

        await interaction.reply({ content: 'Tu grupo de estudio ha sido disuelto.', ephemeral: true});
    },
};
