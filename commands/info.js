const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../data/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Información sobre el bot'),
    
    async execute(interaction) {
        const infoEmbed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('> HyperV Ticket')
            .setDescription(
                "Hecho por <@1288338421772849275>. Contact DM.\n\n" +
                "Buy here: [HyperV Store](https://hyperv.online)"
            )
            .setImage(config.defaultImage);

        await interaction.reply({ embeds: [infoEmbed] });
    }
};
