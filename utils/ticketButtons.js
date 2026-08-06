const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function createTicketButton(
  customId,
  label = "Comprar en Ticket / Buy on Ticket",
  emoji = "<:soporte:1232042953908949034>",
) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(emoji),
  );
}

function createLanguageTicketButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_general_es")
      .setLabel("Abrir Ticket (Español)")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:spain:1466586341134434441>"),
    new ButtonBuilder()
      .setCustomId("ticket_general_en")
      .setLabel("Open Ticket (English)")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:flagunitedstates:1232045303574827080>"),
  );
}

const ticketClaimButton = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("ticket-claim")
    .setLabel("Reclamar ticket")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("<:soporte:1316466482653171763>"),
);

const ticketCloseButton = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("ticket-close")
    .setLabel("Cerrar ticket")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("<:candado:1465454456236675345>"),
);

module.exports = {
  createTicketButton,
  createLanguageTicketButtons,
  ticketClaimButton,
  ticketCloseButton,
};