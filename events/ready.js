const { ActivityType, MessageFlags } = require("discord.js");
const channelData = require("../data/channelData");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log("¡Bot listo!");

    let ActivityIndex = 0;
    const activities = [
      { name: "+8400 clientes activos", type: ActivityType.Watching },
      { name: "Consulta sobre nuestros productos", type: ActivityType.Listening },
      { name: "HyperV - Desarrolladora de Software", type: ActivityType.Playing },
      { name: "Visita hyperv.online", type: ActivityType.Watching },
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

        let payload;

        if (channel.container) {
          payload = {
            embeds: [],
            components: [channel.container],
            flags: MessageFlags.IsComponentsV2,
          };
        } else {
          const embeds = [channel.embed, ...(channel.extraEmbeds || [])];
          const components = channel.components?.length ? channel.components : channel.menu ? [channel.menu] : [];
          payload = { embeds, components };
        }

        if (channel.messageId) {
          try {
            const message = await targetChannel.messages.fetch(channel.messageId);
            await message.edit(payload);
            console.log(`Embed editado en canal ${channel.id}`);
          } catch {
            console.warn(`No se pudo editar mensaje ${channel.messageId}, enviando nuevo...`);
            const sent = await targetChannel.send(payload);
            console.log(`Embed enviado en canal ${channel.id} — messageId: ${sent.id}`);
          }
        } else {
          const sent = await targetChannel.send(payload);
          console.log(`Embed enviado en canal ${channel.id} — messageId: ${sent.id}`);
        }

        // ✅ Mensaje extra separado (solo para entradas con container + extraEmbeds)
        if (channel.container && channel.extraEmbeds?.length) {
          const extraPayload = { embeds: channel.extraEmbeds, components: [] };

          if (channel.extraMessageId) {
            try {
              const extraMsg = await targetChannel.messages.fetch(channel.extraMessageId);
              await extraMsg.edit(extraPayload);
              console.log(`Embed extra editado en canal ${channel.id}`);
              continue;
            } catch {
              console.warn(`No se pudo editar mensaje extra ${channel.extraMessageId}, enviando nuevo...`);
            }
          }

          const sentExtra = await targetChannel.send(extraPayload);
          console.log(`Embed extra enviado en canal ${channel.id} — extraMessageId: ${sentExtra.id}`);
        }
      } catch (error) {
        console.error(`Error en canal ${channel.id}:`, error);
      }
    }
  },
};