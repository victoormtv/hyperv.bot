const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { categories, roles } = require("../data/ids");
const config = require("../data/config");

const DATA_FILE = path.join(__dirname, "../data/inactiveTickets.json");

const WARNING_TIME = 2 * 60 * 60 * 1000;
const CLOSE_TIME = 4 * 60 * 60 * 1000;
const DELETE_TIME = 6 * 60 * 60 * 1000;

function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ tickets: {} }, null, 2));
    }
    const rawData = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error al cargar inactiveTickets.json:", error);
    return { tickets: {} };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al guardar inactiveTickets.json:", error);
  }
}

async function updateTicketActivity(channelId, userId, isStaff = false) {
  const data = loadData();

  if (!data.tickets[channelId]) {
    data.tickets[channelId] = {
      ownerId: userId,
      lastClientActivity: Date.now(),
      warningGiven: false,
      closed: false,
      closedAt: null,
    };
  } else if (!isStaff) {
    data.tickets[channelId].lastClientActivity = Date.now();
    data.tickets[channelId].warningGiven = false;
  }

  saveData(data);
}

async function registerNewTicket(channelId, ownerId) {
  const data = loadData();
  if (!data.tickets[channelId]) {
    data.tickets[channelId] = {
      ownerId: ownerId,
      lastClientActivity: Date.now(),
      warningGiven: false,
      closed: false,
      closedAt: null,
    };
    saveData(data);
  }
}

async function unregisterTicket(channelId) {
  const data = loadData();
  if (data.tickets[channelId]) {
    delete data.tickets[channelId];
    saveData(data);
    console.log(`🗑️ Ticket eliminado del sistema: ${channelId}`);
  }
}

async function checkInactiveTickets(client) {
  console.log("🔍 Verificando tickets inactivos...");

  const data = loadData();
  const now = Date.now();

  try {
    const guild = client.guilds.cache.first();
    if (!guild) return;

    const ticketCategory = guild.channels.cache.get(categories.TICKETS);
    if (!ticketCategory) return;

    const ticketChannels = guild.channels.cache.filter(
      (channel) => channel.parentId === categories.TICKETS,
    );

    for (const [channelId, channel] of ticketChannels) {
      if (!data.tickets[channelId]) {
        continue;
      }

      const ticketData = data.tickets[channelId];
      const timeSinceLastActivity = now - ticketData.lastClientActivity;

      // ====== ELIMINAR CANAL (4h después del cierre) ======
      if (ticketData.closed && ticketData.closedAt) {
        const timeSinceClosed = now - ticketData.closedAt;

        if (timeSinceClosed >= DELETE_TIME) {
          console.log(`🗑️ Eliminando ticket cerrado: ${channel.name}`);

          try {
            await channel.delete();
            await unregisterTicket(channelId);
            console.log(`✅ Ticket eliminado exitosamente`);
          } catch (error) {
            console.error(`Error al eliminar ticket ${channelId}:`, error);
          }
          continue;
        }
      }

      // ====== CERRAR TICKET (1h sin actividad del cliente) ======
      if (timeSinceLastActivity >= CLOSE_TIME && !ticketData.closed) {
        console.log(`🔒 Cerrando ticket por inactividad: ${channel.name}`);

        const closeEmbed = new EmbedBuilder()
          .setTitle("> HyperV - Ticket Cerrado")
          .setDescription(
            "Este ticket ha sido cerrado por inactividad.\n\n**El canal será eliminado en 6 horas.**\n\nSi necesitas ayuda nuevamente, crea un nuevo ticket.",
          )
          .setColor(config.embedColor)
          .setFooter(config.embedFooter)
          .setTimestamp();

        try {
          await channel.send({ embeds: [closeEmbed] });

          data.tickets[channelId].closed = true;
          data.tickets[channelId].closedAt = now;
          saveData(data);

          await channel.setName(`🔒-${channel.name.replace("🔒-", "")}`);

          console.log(`✅ Ticket cerrado exitosamente`);
        } catch (error) {
          console.error(`Error al cerrar ticket ${channelId}:`, error);
        }
        continue;
      }

      // ====== ENVIAR ADVERTENCIA ======
      if (
        timeSinceLastActivity >= WARNING_TIME &&
        !ticketData.warningGiven &&
        !ticketData.closed
      ) {
        console.log(`⚠️ Enviando advertencia a: ${channel.name}`);

        const warningEmbed = new EmbedBuilder()
          .setTitle("> HyperV - Recordatorio de Ticket")
          .setDescription(
            `⚠️ Este ticket lleva **2 horas sin respuesta**.\n\nPor favor, responde si aún necesitas ayuda. El ticket se cerrará automáticamente después de **4 hora** de inactividad total.`,
          )
          .setColor(0xffaa00)
          .setFooter(config.embedFooter)
          .setTimestamp();

        try {
          await channel.send({
            embeds: [warningEmbed],
          });

          data.tickets[channelId].warningGiven = true;
          saveData(data);

          console.log(`✅ Advertencia enviada exitosamente`);
        } catch (error) {
          console.error(
            `Error al enviar advertencia al ticket ${channelId}:`,
            error,
          );
        }
      }
    }

    for (const channelId in data.tickets) {
      if (!guild.channels.cache.has(channelId)) {
        await unregisterTicket(channelId);
      }
    }

    console.log("✅ Verificación de inactividad completada");
  } catch (error) {
    console.error("Error en checkInactiveTickets:", error);
  }
}

module.exports = {
  updateTicketActivity,
  registerNewTicket,
  unregisterTicket,
  checkInactiveTickets,
};
