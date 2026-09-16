const { SlashCommandBuilder } = require("discord.js");
const { enviarPanelGratis } = require("../utils/panelGratis.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel-gratis")
        .setDescription("Envía el panel gratis"),
    async execute(interaction) {
        await interaction.reply({ content: "Enviando panel...", ephemeral: true });
        await enviarPanelGratis(interaction.channel);
    },
};