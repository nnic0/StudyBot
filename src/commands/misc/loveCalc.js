const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lovecalc')
    .setDescription('Calcula el nivel de amor entre dos usuarios')
    .addStringOption(option =>
      option.setName('persona1')
        .setDescription('@persona1')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('persona2')
        .setDescription('@persona2')
        .setRequired(true)
    ),
  async execute(interaction) {
    const persona1 = interaction.options.getString('persona1');
    const persona2 = interaction.options.getString('persona2');

    const idEspecial1 = '898041532815396875';
    const idEspecial2 = '493851314430803968';

    const amorMaximo = (persona1 === idEspecial1 && persona2 === idEspecial2) ||
                       (persona1 === idEspecial2 && persona2 === idEspecial1);

    const nivelAmor = amorMaximo ? 100 : Math.floor(Math.random() * 101);
    let msg = '';
    if(nivelAmor == 100){
        msg = '¡Son almas gemelas!'
    } else if(nivelAmor > 90){
        msg = '¡Podrían hacer una buena pareja!'
    } else if(nivelAmor > 80){
        msg = '¡Seguramente durarían muchos años'
    } else if(nivelAmor > 50){
        msg = '¡Muy buenos amigos!'
    } else if(nivelAmor > 10){
        msg = '¡Al menos no se odian!'
    } else if(nivelAmor > 0){
        msg = '¡No hay peor pareja!'
    }

    interaction.reply(`El nivel de amor entre ${persona1} y ${persona2} es del ${nivelAmor}% 💖 ` + msg);
  },
};
