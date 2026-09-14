const {
    ContainerBuilder,
    SectionBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
} = require("discord.js");
const config = require("../data/config.js");

async function enviarPanelLicenciasWindows(channel) {
    const container = new ContainerBuilder()
        .setAccentColor(config.embedColor)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## HyperV | Licencias Windows"),
        )
        .addSeparatorComponents(new SeparatorBuilder())
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("__Recursos Oficiales__"),
        )
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("🪟 **Windows 10 Pro - Licencia Digital**"),
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setLabel("Comprar")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://hyperv.online/licencias/win10pro"),
                ),
        )
        .addSeparatorComponents(new SeparatorBuilder())
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("🪟 **Windows 11 Pro - Licencia Digital**"),
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setLabel("Comprar")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://hyperv.online/licencias/win11pro"),
                ),
        )
        .addSeparatorComponents(new SeparatorBuilder())
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("📄 **Guía de Activación**"),
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setLabel("Ver Guía")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://hyperv.online/docs/activacion-windows"),
                ),
        )
        .addSeparatorComponents(new SeparatorBuilder())
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("🛠️ **Soporte de Activación**"),
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setLabel("Abrir Ticket")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://hyperv.online/support"),
                ),
        );

    await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    });
}

module.exports = { enviarPanelLicenciasWindows };