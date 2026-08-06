const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { roles, categories } = require("../data/ids");
const config = require("../data/config");

function isInTicket(interaction) {
  return interaction.channel.parentId === categories.TICKETS;
}

function isVendor(interaction) {
  const userRoles = interaction.member.roles.cache;
  return (
    roles.ADMIN.some((adminId) => userRoles.has(adminId)) ||
    userRoles.has(roles.VENDOR) ||
    userRoles.has(roles.SUPPORT)
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("instalacion")
    .setDescription("Muestra guía de instalación de productos")
    .addStringOption((option) =>
      option
        .setName("producto")
        .setDescription("Selecciona el producto")
        .setRequired(true)
        .addChoices({ name: "Productos de PC", value: "panel-emulador" }),
    ),

  async execute(interaction) {
    if (!isInTicket(interaction)) {
      return await interaction.reply({
        content: "⚠️ Este comando solo puede usarse dentro de un ticket.",
        flags: 64,
      });
    }

    if (!isVendor(interaction)) {
      return await interaction.reply({
        content: "❌ Solo los vendedores pueden ejecutar este comando.",
        flags: 64,
      });
    }

    const producto = interaction.options.getString("producto");

    const guias = {
      "panel-emulador": {
        titulo: "> Instalación: Productos de PC",
        pasos: [
          "Para instalar nuestros productos, visita nuestra página web. Allí encontrarás los pasos y requisitos necesarios para su uso. Haz clic en el enlace de abajo.:\n- [`Click aquí`](https://hyperv.online/tutorial/panel-full)",
          "**__SOPORTE:__**\n- Si tienes problemas, contacta al soporte asignado\n- Envía capturas de pantalla del error\n- No compartas tu licencia con nadie",
        ],
        thumbnail: "https://i.ibb.co/9kwN9msc/PERFIL-HYPER-V-AZUL-5.png",
        color: config.embedColor,
      },
    };

    const guia = guias[producto];

    if (!guia) {
      return await interaction.reply({
        content: "⚠️ Guía no encontrada.",
        flags: 64,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(guia.titulo)
      .setDescription(guia.pasos.join("\n\n"))
      .setColor(guia.color)
      .setThumbnail(guia.thumbnail)
      .setFooter(config.embedFooter)
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });

    console.log(
      `📖 ${interaction.user.tag} envió guía de instalación: ${producto}`,
    );
  },
};
