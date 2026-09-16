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

function buildProductContainer({ title, functions, prices, image, color, buttons = [] }) {
    const container = new ContainerBuilder().setAccentColor(color || config.embedColor);

    if (image) {
        container.addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(image)),
        );
    }

    // Título
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(title));

    // Funciones
    if (functions) {
        container.addSeparatorComponents(new SeparatorBuilder());
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(functions));
    }

    // Precios
    if (prices) {
        container.addSeparatorComponents(new SeparatorBuilder());
        const priceText = Array.isArray(prices)
            ? prices.map((p) => `<:garantia:1321973733971333150> ${p}`).join("\n")
            : prices;
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(priceText));
    }

    // Botones
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

module.exports = { buildProductContainer };