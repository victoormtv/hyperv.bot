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

        // 1. Procesar el mensaje principal (Embed o Container V2)
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
            console.log(`Embed principal editado en canal ${channel.id}`);
          } catch {
            console.warn(`No se pudo editar mensaje principal ${channel.messageId}, enviando nuevo...`);
            const sent = await targetChannel.send(payload);
            channel.messageId = sent.id;
            console.log(`Embed principal enviado en canal ${channel.id} — messageId: ${sent.id}`);
          }
        } else {
          const sent = await targetChannel.send(payload);
          channel.messageId = sent.id;
          console.log(`Embed principal enviado en canal ${channel.id} — messageId: ${sent.id}`);
        }

        // 2. Procesar el segundo mensaje automático (extraContainer / botones de compra) de forma independiente
        if (channel.container && channel.extraContainer) {
          const extraPayload = {
            embeds: [],
            components: [channel.extraContainer],
            flags: MessageFlags.IsComponentsV2,
          };

          if (channel.extraMessageId && channel.extraMessageId !== "TU_MESSAGE_ID_AQUI") {
            try {
              const extraMsg = await targetChannel.messages.fetch(channel.extraMessageId);
              await extraMsg.edit(extraPayload);
              console.log(`Embed extra (botones) editado en canal ${channel.id}`);
            } catch {
              console.warn(`No se pudo editar el mensaje extra guardado, enviando uno nuevo...`);
              const sentExtra = await targetChannel.send(extraPayload);
              channel.extraMessageId = sentExtra.id;
              console.log(`Embed extra enviado — Nuevo ID: ${sentExtra.id}`);
            }
          } else {
            const sentExtra = await targetChannel.send(extraPayload);
            channel.extraMessageId = sentExtra.id;
            console.log(`Embed extra enviado por primera vez — extraMessageId: ${sentExtra.id}`);
          }
        }

        if (channel.container && channel.extraEmbeds?.length) {
          const extraPayload = { embeds: channel.extraEmbeds, components: [] };

          if (channel.extraMessageId) {
            try {
              const extraMsg = await targetChannel.messages.fetch(channel.extraMessageId);
              await extraMsg.edit(extraPayload);
              console.log(`Embed extra clásico editado en canal ${channel.id}`);
              continue;
            } catch {
              console.warn(`No se pudo editar mensaje extra clásico, enviando nuevo...`);
            }
          }

          const sentExtra = await targetChannel.send(extraPayload);
          channel.extraMessageId = sentExtra.id;
          console.log(`Embed extra clásico enviado en canal ${channel.id} — extraMessageId: ${sentExtra.id}`);
        }

      } catch (error) {
        console.error(`Error en canal ${channel.id}:`, error);
      }
    }
  },
};