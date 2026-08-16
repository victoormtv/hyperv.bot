const { ActivityType } = require("discord.js");
const channelData = require("../data/channelData");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log("¡Bot listo!");

    let ActivityIndex = 0;
    const activities = [
      { name: "+6000 clientes activos", type: ActivityType.Watching },
      { name: "Consulta sobre nuestros productos", type: ActivityType.Listening },
      { name: "HyperV - El mejor panel", type: ActivityType.Playing },
    ];

    if (client.user) {
      setInterval(() => {
        ActivityIndex = (ActivityIndex + 1) % activities.length;
        client.user.setPresence({
          activities: [activities[ActivityIndex]],
          status: "online",
        });
      }, 5000);
    }

    for (const channel of channelData) {
      try {
        const targetChannel = await client.channels.fetch(channel.id);
        if (!targetChannel.isTextBased()) continue;

        const embeds = [channel.embed, ...(channel.extraEmbeds || [])];
        const components = channel.components?.length ? channel.components : channel.menu ? [channel.menu] : [];

        if (channel.messageId) {
          try {
            const message = await targetChannel.messages.fetch(channel.messageId);
            await message.edit({ embeds, components });
            console.log(`Embed editado en canal ${channel.id}`);
            continue;
          } catch {
            console.warn(`No se pudo editar mensaje ${channel.messageId}, enviando nuevo...`);
          }
        }

        const sent = await targetChannel.send({ embeds, components });
        console.log(`Embed enviado en canal ${channel.id} — messageId: ${sent.id}`);
      } catch (error) {
        console.error(`Error en canal ${channel.id}:`, error);
      }
    }
  },
};