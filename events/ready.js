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
      {
        name: "Consulta sobre nuestros productos",
        type: ActivityType.Listening,
      },
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
        if (!targetChannel.isTextBased()) {
          console.error(
            `El canal ${channel.id} no es válido para mensajes de texto.`,
          );
          continue;
        }

        const embeds = [channel.embed, ...(channel.extraEmbeds || [])];

        const messageOptions = { embeds };

        if (channel.menu) {
          messageOptions.components = [channel.menu];
        } else if (channel.components && channel.components.length > 0) {
          messageOptions.components = channel.components;
        }

        await targetChannel.send(messageOptions);
        console.log(`Mensaje de embed enviado en canal ${channel.id}`);
      } catch (error) {
        console.error(`Error enviando mensaje en canal ${channel.id}:`, error);
      }
    }
  },
};
