const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lovecalc')
    .setDescription('Calcula el nivel de amor entre dos usuarios')
    .addUserOption(option =>
      option.setName('persona1')
        .setDescription('Selecciona a la primera persona')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('persona2')
        .setDescription('Selecciona a la segunda persona')
        .setRequired(true)
    ),
  async execute(interaction) {
    const firstUserId = interaction.options.getUser('persona1');
    const secondUserId = interaction.options.getUser('persona2');

    const specialIds = ['493851314430803968', '898041532815396875']
    const loveMax = specialIds.includes(firstUserId.id) && specialIds.includes(secondUserId.id);

    const nivelAmor = loveMax ? 100 : Math.floor(Math.random() * 101);

    let msg = '';
    if(nivelAmor == 100){
        msg = '¡Son almas gemelas!'
    } else if(nivelAmor > 90){
        msg = '¡Podrían hacer una buena pareja!'
    } else if(nivelAmor > 80){
        msg = '¡Seguramente durarían muchos años!'
    } else if(nivelAmor > 50){
        msg = '¡Muy buenos amigos!'
    } else if(nivelAmor > 10){
        msg = '¡Al menos no se odian!'
    } else if(nivelAmor > 0){
        msg = '¡No hay peor pareja!'
    }

    interaction.reply(`El nivel de amor entre ${firstUserId.globalName} y ${secondUserId.globalName} es del ${nivelAmor}% 💖 ` + msg);
  },
};
