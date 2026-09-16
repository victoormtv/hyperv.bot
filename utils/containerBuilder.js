const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const config = require("../data/config");

function pinify(text) {
    return text.replace(/^- /gm, "📌 ").replace(/\n- /g, "\n📌 ");
}

function buildProductContainer({ title, description, image, color, buttons = [] }) {
    const container = new ContainerBuilder().setAccentColor(color || config.embedColor);

    if (image) {
        container.addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(image)),
        );
    }

    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ${title}`));

    if (description) {
        container.addSeparatorComponents(new SeparatorBuilder());
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(pinify(description)));
    }

    if (buttons.length) {
        container.addSeparatorComponents(new SeparatorBuilder());
        const row = new ActionRowBuilder().addComponents(
            buttons.map((b) => {
                const btn = new ButtonBuilder().setLabel(b.label).setStyle(b.style);
                if (b.style === ButtonStyle.Link) btn.setURL(b.url);
                else btn.setCustomId(b.customId);
                if (b.emoji) btn.setEmoji(b.emoji);
                return btn;
            }),
        );
        container.addActionRowComponents(row);
    }

    return container;
}

module.exports = { buildProductContainer, pinify };