const {
    ContainerBuilder,
    SectionBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
} = require("discord.js");
const config = require("../data/config.js");

async function enviarPanelLicenciasWindows(channel) {
    const container = new ContainerBuilder()
        .setAccentColor(config.embedColor)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("> HyperV - Panel Gratis"),
        )
        .addSeparatorComponents(new SeparatorBuilder())
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("__Página Web:__"),
        )
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("Ingresa aqui"),
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setLabel("Click Aqui")
                        .setEmoji({ name: 'download', id: '1505630527535972402' })
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://hyperv.online/gratis"),
                ),
        )
        .addSeparatorComponents(new SeparatorBuilder())
        .addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder().setURL(config.defaultImage),
            ),
        )
    await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    });
}

module.exports = { enviarPanelLicenciasWindows };