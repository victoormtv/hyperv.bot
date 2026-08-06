const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const config = require("../data/config");

const freePanelUsersPath = path.join(__dirname, "../data/freepanel.json");
const keysFilePath = path.join(__dirname, "../data/panel_keys.json");

function loadFreePanelUsers() {
  if (!fs.existsSync(freePanelUsersPath)) return [];
  return JSON.parse(fs.readFileSync(freePanelUsersPath, "utf-8"));
}

function saveFreePanelUsers(data) {
  fs.writeFileSync(freePanelUsersPath, JSON.stringify(data, null, 2));
}

// ─── Lee y extrae una key del archivo panel_keys.json ─────────────────────────
function getKeyFromJson() {
  if (!fs.existsSync(keysFilePath)) return null;
  const keysData = JSON.parse(fs.readFileSync(keysFilePath, "utf-8"));
  if (!keysData.keys || keysData.keys.length === 0) return null;
  const key = keysData.keys.shift(); // Toma la primera key y la elimina del array
  fs.writeFileSync(keysFilePath, JSON.stringify(keysData, null, 2));
  return key;
}
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (
      !interaction.customId.startsWith("panel_aprobar_") &&
      !interaction.customId.startsWith("panel_rechazar_")
    )
      return;

    try {
      await interaction.deferUpdate();
    } catch (e) {
      console.error("No se pudo hacer deferUpdate:", e.message);
      return;
    }

    try {
      const partes = interaction.customId.split("_");
      const accion = partes[1]; // "aprobar" o "rechazar"
      const solicitudId = parseInt(partes[2]);

      const users = loadFreePanelUsers();
      const solicitud = users.find((u) => u.solicitudId === solicitudId);

      if (!solicitud) {
        return await interaction.followUp({
          content: `❌ Solicitud #${solicitudId} no encontrada.`,
          ephemeral: true,
        });
      }

      if (solicitud.estado !== "pendiente") {
        return await interaction.followUp({
          content: `⚠️ Esta solicitud ya fue **${solicitud.estado}**.`,
          ephemeral: true,
        });
      }

      if (accion === "aprobar") {
        // ── Obtener key desde panel_keys.json ────────────────────────────────
        const key = getKeyFromJson();

        if (!key) {
          return await interaction.followUp({
            content: `❌ No hay keys disponibles en \`panel_keys.json\`.`,
            ephemeral: true,
          });
        }
        // ─────────────────────────────────────────────────────────────────────

        solicitud.estado = "aprobada";
        solicitud.licenciaGenerada = true;
        solicitud.licencia = key;
        solicitud.fechaAprobacion = new Date().toISOString();
        solicitud.aprobadoPor = interaction.user.tag;

        const userIndex = users.findIndex((u) => u.solicitudId === solicitudId);
        users[userIndex] = solicitud;
        saveFreePanelUsers(users);

        try {
          const user = await interaction.client.users.fetch(solicitud.userId);
          const licenciaEmbed = new EmbedBuilder()
            .setTitle("> Tu Panel FREE fue APROBADO")
            .setDescription(
              `- Producto: **Panel Secure Gratis**\n` +
                `- Duración: **3 días**\n\n` +
                `- Tu licencia:\n\`\`\`${key}\`\`\`\n\n` +
                `Ingresa aquí y sigue los pasos:\n` +
                `https://hyperv.online/free/panel-free/\n\n` +
                `¿Te gustó? Contacta con nuestro equipo para adquirir algunos de nuestros planes.`,
            )
            .setColor(config.embedColor)
            .setThumbnail(config.embedThumbnail)
            .setImage(config.defaultImage)
            .setFooter(config.embedFooter)
            .setTimestamp();

          await user.send({ embeds: [licenciaEmbed] });
        } catch (dmError) {
          console.error("❌ No se pudo enviar DM:", dmError.message);
        }

        const embedActualizado = EmbedBuilder.from(
          interaction.message.embeds[0],
        )
          .setDescription(
            interaction.message.embeds[0].description +
              `\n\n✅ **Estado:** APROBADA\n🔑 **Licencia:** \`${key}\``,
          )
          .setFooter({
            text: `Aprobada por ${interaction.user.tag}`,
            iconURL: config.embedFooter.iconURL,
          });

        await interaction.editReply({
          embeds: [embedActualizado],
          components: [],
        });

        await interaction.followUp({
          content: `✅ Solicitud #${solicitudId} aprobada. Licencia enviada por DM a <@${solicitud.userId}>.`,
          ephemeral: true,
        });

      } else if (accion === "rechazar") {
        solicitud.estado = "rechazada";
        solicitud.fechaRechazo = new Date().toISOString();
        solicitud.rechazadoPor = interaction.user.tag;

        const userIndex = users.findIndex((u) => u.solicitudId === solicitudId);
        users[userIndex] = solicitud;
        saveFreePanelUsers(users);

        try {
          const user = await interaction.client.users.fetch(solicitud.userId);
          const rechazoEmbed = new EmbedBuilder()
            .setTitle("❌ Solicitud Rechazada")
            .setDescription(
              "Tu solicitud de Panel FREE fue rechazada.\n\n" +
                "**Motivos comunes:**\n" +
                "- Capturas incompletas o falsas\n" +
                "- No seguiste los pasos correctamente\n\n" +
                "Puedes volver a intentarlo con `/freepanel`.",
            )
            .setColor("#FF0000")
            .setThumbnail(config.embedThumbnail)
            .setFooter(config.embedFooter)
            .setTimestamp();

          await user.send({ embeds: [rechazoEmbed] });
        } catch (dmError) {
          console.error("❌ No se pudo enviar DM:", dmError.message);
        }

        const embedActualizado = EmbedBuilder.from(
          interaction.message.embeds[0],
        )
          .setDescription(
            interaction.message.embeds[0].description +
              `\n\n❌ **Estado:** RECHAZADA`,
          )
          .setFooter({
            text: `Rechazada por ${interaction.user.tag}`,
            iconURL: config.embedFooter.iconURL,
          });

        await interaction.editReply({
          embeds: [embedActualizado],
          components: [],
        });

        await interaction.followUp({
          content: `❌ Solicitud #${solicitudId} rechazada.`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("❌ Error en verifyFreePanelGratis:", error);
      try {
        await interaction.followUp({
          content: "❌ Ocurrió un error interno. Intenta de nuevo.",
          ephemeral: true,
        });
      } catch (_) {}
    }
  },
};