const { Interaction, Client, Collection, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-member')
        .setDescription('Elimina un miembro del grupo de estudio')
        .addStringOption(option => option.setName('miembro').setDescription('Nombre o mención del miembro').setRequired(true)),
    async execute(interaction) {
        const memberString = interaction.options.getString('miembro');
        const memberId = memberString.replace(/[<@!>]/g, ''); // Filtra el ID

        if (!interaction.client.groups) {
            interaction.client.groups = new Collection();
        }

        const group = interaction.client.groups.get(interaction.user.id);

        if (!group) {
            return interaction.reply({ content: 'No tienes ningún grupo creado.', ephemeral: true});
        }

        if (!group.includes(memberId)) {
            return interaction.reply({ content: 'Ese miembro no está en tu grupo.', ephemeral: true});
        }

        const updatedGroup = group.filter(id => id !== memberId);
        interaction.client.groups.set(interaction.user.id, updatedGroup);

        await interaction.reply({ content: `Miembro <@${memberId}> eliminado del grupo.`, ephemeral: true});
    },
};
