const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../data/config.js");

async function enviarPanelLicenciasWindows(channel) {
    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle("HyperV | Licencias Windows")
                .setDescription("**Recursos Oficiales**")
                .setColor(config.embedColor)
                .setImage(config.defaultImage),
        ],
    });

    await channel.send({
        content: "🪟 **Windows 10 Pro - Licencia Digital**",
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Comprar")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://hyperv.online/licencias/win10pro"),
            ),
        ],
    });

    await channel.send({
        content: "🪟 **Windows 11 Pro - Licencia Digital**",
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Comprar")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://hyperv.online/licencias/win11pro"),
            ),
        ],
    });

    await channel.send({
        content: "📄 **Guía de Activación Paso a Paso**",
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Ver Guía")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://hyperv.online/docs/activacion-windows"),
            ),
        ],
    });

    await channel.send({
        content: "🛠️ **Soporte de Activación**",
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Abrir Ticket")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://hyperv.online/support"),
            ),
        ],
    });
}

module.exports = { enviarPanelLicenciasWindows };
