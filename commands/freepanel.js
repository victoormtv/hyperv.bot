const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../data/config");
const { roles } = require("../data/ids");

const freePanelFilePath = path.join(__dirname, "../data/freepanel.json");

function loadFreePanelUsers() {
  if (!fs.existsSync(freePanelFilePath)) {
    fs.writeFileSync(freePanelFilePath, JSON.stringify([], null, 2));
    return [];
  }
  return JSON.parse(fs.readFileSync(freePanelFilePath, "utf-8"));
}

function saveFreePanelUsers(data) {
  fs.writeFileSync(freePanelFilePath, JSON.stringify(data, null, 2));
}

function yaUsoFree(userId) {
  const users = loadFreePanelUsers();
  return users.some(
    (u) => u.userId === userId && u.licenciaGenerada && !u.esStaff,
  );
}

function tieneRolExcluido(member) {
  const rolesExcluidos = [
    ...roles.ADMIN,
    roles.SUPPORT,
    roles.SELLER,
    roles.VERIFIED,
  ]
    .filter(Boolean)
    .flat();
  return rolesExcluidos.some((roleId) => member.roles.cache.has(roleId));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("freepanel")
    .setDescription("Acceso gratuito al panel por 3 días")
    .addAttachmentOption((option) =>
      option
        .setName("captura")
        .setDescription("Screenshot del follow a @hypervgg.pe")
        .setRequired(true),
    ),

  async execute(interaction) {
    const CANAL_FREEPANEL = "1471692818077712444";
    if (interaction.channelId !== CANAL_FREEPANEL) {
      return await interaction.reply({
        content: `Este comando solo puede usarse en <#${CANAL_FREEPANEL}>.`,
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: false });

    const userId = interaction.user.id;
    const member = interaction.member;
    const captura = interaction.options.getAttachment("captura");

    const tiposValidos = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!tiposValidos.includes(captura.contentType)) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("> Formato inválido")
        .setDescription(
          `La captura "${captura.name}" no es válida.\n\n**Formatos aceptados:** PNG, JPG, WEBP`,
        )
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setTimestamp();
      return await interaction.editReply({ embeds: [errorEmbed] });
    }

    const esStaff = tieneRolExcluido(member);

    if (!esStaff && yaUsoFree(userId)) {
      const yaUsadoEmbed = new EmbedBuilder()
        .setTitle("> Ya usaste tu Panel Free")
        .setDescription(
          "Solo puedes obtener 1 Panel Gratis por cuenta.\n\nSi deseas más acceso, consulta nuestros planes premium.",
        )
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setTimestamp();
      return await interaction.editReply({ embeds: [yaUsadoEmbed] });
    }

    const users = loadFreePanelUsers();
    const solicitudId = users.length + 1;

    const nuevaSolicitud = {
      solicitudId,
      userId: interaction.user.id,
      username: interaction.user.tag,
      capturaUrl: captura.url,
      estado: "pendiente",
      fechaSolicitud: new Date().toISOString(),
      licenciaGenerada: false,
      licencia: null,
      esStaff: esStaff,
    };

    users.push(nuevaSolicitud);
    saveFreePanelUsers(users);

    const confirmacionEmbed = new EmbedBuilder()
      .setTitle("> Solicitud Enviada")
      .setDescription(
        `Tu solicitud **#${solicitudId}** ha sido recibida.\n\n` +
          `- **Producto:** Panel Secure Gratis\n` +
          `- **Días:** 3 días\n` +
          `- **Requisito:** Follow a **@_hypervgg**\n\n` +
          (esStaff
            ? "**Rol Staff detectado:** Puedes solicitar múltiples Panel Free.\n\n"
            : "") +
          `- **Tiempo de verificación:** Menos de 24h\n` +
          `- **Entrega:** Recibirás tu licencia por DM\n\n` +
          `Instagram: **@hypervgg.pe**`,
      )
      .setColor(config.embedColor)
      .setThumbnail(config.embedThumbnail)
      .setFooter(config.embedFooter)
      .setTimestamp();

    await interaction.editReply({ embeds: [confirmacionEmbed] });

    const CANAL_VERIFICACION = "1472643257971245321";
    try {
      const {
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle,
      } = require("discord.js");
      const canalLogs =
        await interaction.client.channels.fetch(CANAL_VERIFICACION);

      const logEmbed = new EmbedBuilder()
        .setTitle(`> Nueva Solicitud Panel Free #${solicitudId}`)
        .setDescription(
          `- **Usuario:** <@${interaction.user.id}> (${interaction.user.tag})\n` +
            `- **Producto:** Panel Secure Gratis\n` +
            `- **Días:** 3 días\n` +
            (esStaff
              ? `- **Usuario Staff:** Puede usar múltiples veces\n`
              : "") +
            `\n**Verifica el follow y aprueba o rechaza:**`,
        )
        .setColor(config.embedColor)
        .setThumbnail(config.embedThumbnail)
        .setFooter(config.embedFooter)
        .setTimestamp();

      const botonesRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`panel_aprobar_${solicitudId}`)
          .setLabel("Aprobar")
          .setStyle(ButtonStyle.Success)
          .setEmoji("✅"),
        new ButtonBuilder()
          .setCustomId(`panel_rechazar_${solicitudId}`)
          .setLabel("Rechazar")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌"),
      );

      await canalLogs.send({ embeds: [logEmbed], components: [botonesRow] });

      const capturaEmbed = new EmbedBuilder()
        .setTitle(`> Captura de Follow - Solicitud #${solicitudId}`)
        .setImage(captura.url)
        .setColor(config.embedColor);
      await canalLogs.send({ embeds: [capturaEmbed] });
    } catch (error) {
      console.error("❌ Error enviando notificación:", error);
    }
  },
};
