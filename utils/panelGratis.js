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

async function enviarPanelGratis(channel) {
    const container = new ContainerBuilder()
        .setAccentColor(config.embedColor)
        .addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder().setURL(
                    "https://www.realcloudx.com/Cloud/tanatozn/panel-free.png",
                ),
            ),
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("## HyperV - Panel Gratis"),
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                "Obtén acceso directo a tu panel gratis y actívalo siguiendo los pasos.",
            ),
        )
        .addSeparatorComponents(new SeparatorBuilder())
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                "> Descarga los recursos necesarios.\n" +
                "> Estar dentro del canal de voz para poder generar tu licencia de Panel Graris.\n" +
                "> Conéctate en <#1548459490574082098>."
            ),
        )
        .addSeparatorComponents(new SeparatorBuilder())
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### Página Web"),
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setLabel("Click Aqui")
                        .setEmoji({ name: 'download', id: '1505630527535972402' })
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://hyperv.online/gratis"),
                ),
        );

    await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    });
}

module.exports = { enviarPanelGratis };