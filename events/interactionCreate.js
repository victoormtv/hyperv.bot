const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  OverwriteType,
  MessageFlags,
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const verifyFreePanelGratis = require("./verifyFreePanel");
const ticketClose = require("../commands/ticket-close");
const ticketClaim = require("../commands/ticket-claim");
const ticketPromotion = require("../commands/ticket-promotion.js");
const ticketCreate = require("../commands/ticket-create");

const config = require("../data/config");
const ids = require("../data/ids");
const { roles } = require("../data/ids");

const keysFilePath = path.join(__dirname, "../data/bypass_keys.json");

function getKeyFromJson() {
  if (!fs.existsSync(keysFilePath)) return null;
  const keysData = JSON.parse(fs.readFileSync(keysFilePath, "utf-8"));
  if (!keysData.keys || keysData.keys.length === 0) return null;
  const key = keysData.keys.shift();
  fs.writeFileSync(keysFilePath, JSON.stringify(keysData, null, 2));
  return key;
}

function sanitizeUsername(username) {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 20);
}

function resolveRoles() {
  const vendor = roles.VENDOR
    ? Array.isArray(roles.VENDOR)
      ? roles.VENDOR
      : [roles.VENDOR]
    : [];
  const support = roles.SUPPORT
    ? Array.isArray(roles.SUPPORT)
      ? roles.SUPPORT
      : [roles.SUPPORT]
    : [];

  return {
    adminAndVendor: [...(roles.ADMIN || []), ...vendor].filter(Boolean),
    allStaff: [...(roles.ADMIN || []), ...vendor, ...support].filter(Boolean),
  };
}

function tienePermisoGenerar(member) {
  const { adminAndVendor } = resolveRoles();
  return adminAndVendor.some((roleId) => member.roles.cache.has(roleId));
}

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`❌ Error ejecutando comando ${interaction.commandName}:`, error);
        try {
          const errorMessage = {
            content: "❌ Error ejecutando comando",
            flags: MessageFlags.Ephemeral,
          };
          if (interaction.deferred) {
            await interaction.editReply(errorMessage);
          } else if (!interaction.replied) {
            await interaction.reply(errorMessage);
          }
        } catch (replyError) {
          console.error("No se pudo responder a la interacción:", replyError.message);
        }
      }
      return;
    }

    if (interaction.isStringSelectMenu()) {
      try {
        if (interaction.customId === "ticket-create") {
          await ticketCreate(interaction, client);
        } else {
          console.warn(`⚠️ CustomId no reconocido: ${interaction.customId}`);
        }
      } catch (error) {
        console.error(`❌ Error ejecutando menú (${interaction.customId}):`, error);
        try {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: "⚠️ Ocurrió un error al procesar tu selección.",
              flags: MessageFlags.Ephemeral,
            });
          }
        } catch (replyError) {
          console.error("No se pudo responder:", replyError.message);
        }
      }
      return;
    }

    if (interaction.isButton()) {
      try {
        if (interaction.customId === "ticket-close") {
          await ticketClose(interaction, client);

        } else if (interaction.customId === "ticket-claim") {
          await ticketClaim.main(interaction, client);

        } else if (interaction.customId === "promocion") {
          await ticketPromotion(interaction, client);

        } else if (interaction.customId.startsWith("ticket_")) {
          await ticketCreate(interaction, client);

        } else if (
          interaction.customId.startsWith("panel_aprobar_") ||
          interaction.customId.startsWith("panel_rechazar_")
        ) {
          await verifyFreePanelGratis.execute(interaction);

        } else if (interaction.customId === "bypass_reclamar_key") {
          // ✅ Manda la key directo por DM sin abrir ticket
          await interaction.deferReply({ ephemeral: true });

          const key = getKeyFromJson();

          if (!key) {
            return await interaction.editReply({
              content: "❌ No hay keys disponibles en este momento. Intenta más tarde.",
            });
          }

          try {
            const keyEmbed = new EmbedBuilder()
              .setTitle("> Tu Bypass Free")
              .setDescription(
                `Tu licencia:\n\`\`\`${key}\`\`\`\n\n` +
                `Ingresa aquí y sigue los pasos:\n` +
                `https://hyperv.online/free/bypass-free/\n\n` +
                `¿Te gustó? Contacta con nuestro equipo para adquirir un plan.`
              )
              .setColor(config.embedColor)
              .setThumbnail(config.embedThumbnail)
              .setImage(config.defaultImage)
              .setFooter(config.embedFooter)
              .setTimestamp();

            await interaction.user.send({ embeds: [keyEmbed] });

            return await interaction.editReply({
              content: "✅ Te enviamos tu key por DM.",
            });
          } catch (dmError) {
            console.error("❌ No se pudo enviar DM:", dmError.message);
            return await interaction.editReply({
              content: "❌ No pudimos enviarte el DM. Asegúrate de tener los DMs abiertos.",
            });
          }

        } else if (interaction.customId.startsWith("generar_bypass_key_")) {
          if (!tienePermisoGenerar(interaction.member)) {
            return await interaction.reply({
              content: "❌ Solo admin o seller pueden generar esta key.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const userId = interaction.customId.replace("generar_bypass_key_", "");
          const key = getKeyFromJson();

          if (!key) {
            return await interaction.reply({
              content: "❌ No hay keys disponibles en `bypass_keys.json`.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const keyEmbed = new EmbedBuilder()
            .setTitle("> Tu Bypass Free fue APROBADO")
            .setDescription(
              `- Usuario: <@${userId}>\n` +
              `- Producto: **Bypass Gratis**\n` +
              `- Duración: **3 días**\n\n` +
              `- Tu licencia:\n\`\`\`${key}\`\`\`\n\n` +
              `Ingresa aquí y sigue los pasos:\n` +
              `https://hyperv.online/free/bypass-free/\n\n` +
              `¿Te gustó? Contacta con nuestro equipo para adquirir algunos de nuestros planes.`
            )
            .setColor(config.embedColor)
            .setThumbnail(config.embedThumbnail)
            .setImage(config.defaultImage)
            .setFooter({
              text: `Generada por ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

          const disabledRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`generar_bypass_key_${userId}`)
              .setLabel("Key generada")
              .setStyle(ButtonStyle.Primary)
              .setEmoji("✅")
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("ticket-close")
              .setLabel("Cerrar ticket")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:candado:1465454456236675345>"),
          );

          await interaction.reply({ embeds: [keyEmbed] });

          try {
            const targetUser = await client.users.fetch(userId);
            await targetUser.send({ embeds: [keyEmbed] });
          } catch (dmError) {
            console.error("❌ No se pudo enviar DM:", dmError.message);
          }

          try {
            await interaction.message.edit({ components: [disabledRow] });
          } catch (editError) {
            console.error("❌ No se pudo desactivar el botón:", editError.message);
          }

        } else {
          console.warn(`⚠️ Botón no reconocido: ${interaction.customId}`);
        }
      } catch (error) {
        console.error(`❌ Error ejecutando botón (${interaction.customId}):`, error);
        try {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: "⚠️ Ocurrió un error al procesar esta acción.",
              flags: MessageFlags.Ephemeral,
            });
          }
        } catch (replyError) {
          console.error("No se pudo responder:", replyError.message);
        }
      }
    }
  },
};