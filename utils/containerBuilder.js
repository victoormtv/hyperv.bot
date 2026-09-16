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

function pinifyFunctions(text) {
    return text
        .trim()
        .replace(/^- /gm, "`📦` ")
        .replace(/^> /gm, "    `📌` ")
        .split('\n')
        .join('\n');
}

function buildInfoContainer({ title, description, image, buttons = [], color }) {
    const container = new ContainerBuilder().setAccentColor(color || config.embedColor);

    if (image) {
        container.addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(image)),
        );
    }

    if (title) {
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(title));
    }

    if (description) {
        container.addSeparatorComponents(new SeparatorBuilder());
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));
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

function buildPurchaseContainer({ description, buttons = [], color }) {
    const container = new ContainerBuilder().setAccentColor(color || config.embedColor);

    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));

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

module.exports = { buildProductContainer, buildPurchaseContainer };