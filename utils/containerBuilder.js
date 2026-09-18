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
        .replace(/^- /gm, "`📌` ")
        .replace(/^> /gm, "    `⚙️` ")
        .split('\n')
        .join('\n');
}

function buildProductContainer({ title, functions, prices, image, color, buttons = [] }) {
    const container = new ContainerBuilder().setAccentColor(color || config.embedColor);

    if (image) {
        container.addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(image)),
        );
    }

    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(title));

    if (functions) {
        container.addSeparatorComponents(new SeparatorBuilder());
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(pinifyFunctions(functions)));
    }

    if (prices) {
        container.addSeparatorComponents(new SeparatorBuilder());
        const priceText = Array.isArray(prices)
            ? prices.map((p) => `<:garantia:1321973733971333150> ${p}`).join("\n")
            : prices;
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(priceText));
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

function buildInfoContainer({ title, description, image, buttons = [], actionRows = [], color }) {
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

    if (actionRows.length) {
        container.addSeparatorComponents(new SeparatorBuilder());
        actionRows.forEach((row) => container.addActionRowComponents(row));
    }

    return container;
}

module.exports = {
    buildProductContainer,
    buildPurchaseContainer,
    buildInfoContainer,
};