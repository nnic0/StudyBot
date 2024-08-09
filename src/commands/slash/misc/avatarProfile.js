const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Muestra el avatar del usuario o de un usuario mencionado')
    .addUserOption(option => 
      option.setName('usuario')
        .setDescription('Selecciona a un usuario para ver su avatar')
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

    await interaction.reply(`La foto de perfil de ${user.username}: ${avatarURL}`);
  },
};
