const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../data/config.js");

async function enviarPanelLicenciasWindows(channel) {
    const embed = new EmbedBuilder()
        .setTitle("HyperV | Licencias Windows")
        .setDescription("**Recursos Oficiales**\n\u200b")
        .addFields(
            { name: "🪟 Windows 10 Pro - Licencia Digital", value: "\u200b", inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "🪟 Windows 11 Pro - Licencia Digital", value: "\u200b", inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "📄 Guía de Activación Paso a Paso", value: "\u200b", inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
        )
        .setColor("#2b2d31")
        .setImage(config.defaultImage);

    await channel.send({
        embeds: [embed],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel("Comprar Win10").setStyle(ButtonStyle.Link).setURL("https://hyperv.online/licencias/win10pro"),
                new ButtonBuilder().setLabel("Comprar Win11").setStyle(ButtonStyle.Link).setURL("https://hyperv.online/licencias/win11pro"),
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel("Ver Guía").setStyle(ButtonStyle.Link).setURL("https://hyperv.online/docs/activacion-windows"),
                new ButtonBuilder().setLabel("Soporte").setStyle(ButtonStyle.Link).setURL("https://hyperv.online/support"),
            ),
        ],
    });
}

module.exports = { enviarPanelLicenciasWindows };