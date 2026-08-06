/*const { EmbedBuilder } = require('discord.js');
const config = require('../data/config');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    try {
      console.log(`👋 Nuevo miembro: ${member.user.tag}`);

      const welcomeEmbed = new EmbedBuilder()
        .setTitle('> ¡Bienvenido a HyperV!')
        .setDescription(
          `**¡Hola ${member.user.username}!** 👋\n\n` +
          `Gracias por unirte a nuestro servidor **HyperV**, lideres en creacion de H4CKS y software's.\n\n` +

          `**¿Cómo crear un ticket?**\n` +
          `<a:1_:1157447561339215963> Dirígete a https://discord.com/channels/1117932314102595716/1118075433800450048 para abrir un ticket\n` +
          `<a:2_:1157447558713581678> Selecciona el tipo de ayuda que necesitas\n` +
          `Un vendedor te atenderá lo antes posible\n\n` +

          `**<a:MI_info_warn:1317201018739495133> EXPLORA NUESTROS PRODUCTOS Y ABRE UN TICKET CON EL PLAN QUE DESEES** <a:MI_info_warn:1317201018739495133>\n\n` +

          `**🌐 Nuestra Tienda Web**\n` +
          `Visita [hyperv.store](https://www.hyperv.store) para ver todos nuestros productos y ADQUIERE.\n\n` +

          `**<a:_alerta_:1316557202621988915> APROVECHA LOS DESCUENTOS, CUPONES Y PROMOCIONES DIARIAS QUE LANZAMOS**\n\n` +

          `**Métodos de Pago Disponibles**\n` +
          `Aceptamos pagos desde cualquier parte del mundo:\n` +
          `- Todo Sudamerica, EE.UU, Europa y más...\n\n` +

          `**Síguenos en Redes Sociales**\n` +
          `<:instagram36:1317355853182926939> [Instagram](https://www.instagram.com/h1perv.pe/)\n` +
          `<a:987340874914619432:1118071042510954548> [TikTok](https://www.tiktok.com/@hypervgg)\n` +
          `<:Youtube:1316608060675985468> [YouTube](https://www.youtube.com/@hyperggg)\n\n` +
          `¡Estamos aquí para ayudarte! `
        )
        .setColor(config.embedColor)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setImage(config.defaultImage)
        .setFooter(config.embedFooter)
        .setTimestamp();

      await member.send({ embeds: [welcomeEmbed] });
      console.log(`✅ Mensaje de bienvenida enviado a ${member.user.tag}`);

    } catch (error) {
      if (error.code === 50007) {
        console.log(`⚠️ No se pudo enviar DM a ${member.user.tag} (DMs cerrados)`);
      } else {
        console.error(`❌ Error al enviar mensaje de bienvenida:`, error);
      }
    }
  }
};
*/