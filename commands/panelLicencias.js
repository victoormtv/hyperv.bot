const { SlashCommandBuilder } = require("discord.js");
const { enviarPanelLicenciasWindows } = require("../utils/panelLicencias.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel-licencias")
        .setDescription("Envía el panel de licencias de Windows"),
    async execute(interaction) {
        await interaction.reply({ content: "Enviando panel...", ephemeral: true });
        await enviarPanelLicenciasWindows(interaction.channel);
    },
};