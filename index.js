require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  Collection,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const { checkInactiveTickets } = require("./utils/inactivityChecker");
const { actualizarTasasDeCambio } = require("./data/commissionRules");
const { startFeedbackServer } = require("./utils/feedbackServer");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
  ],
});

// ========== CARGA DE COMANDOS ==========
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  }
}

// ========== CARGA DE EVENTOS ==========
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ========== MANEJO DE AUTOCOMPLETADO ==========
client.on("interactionCreate", async (interaction) => {
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error("❌ Error en autocompletado:", error);
    }
  }
});

// ========== SISTEMA DE AUTO-ACTUALIZACIÓN DE EMBEDS ==========
const channelDataPath = path.join(__dirname, "./data/channelData.js");
let channelData = require(channelDataPath);

async function updateEmbeds() {
  for (const item of channelData) {
    try {
      const channel = await client.channels.fetch(item.id);
      const message = await channel.messages.fetch(item.messageId);

      const editOptions = { embeds: [item.embed] };
      if (item.menu) {
        editOptions.components = [item.menu];
      }

      await message.edit(editOptions);
    } catch (err) {
      console.warn(
        `⚠️ No se pudo editar embed en canal ${item.id}: ${err.message}`,
      );
    }
  }
}

fs.watchFile(channelDataPath, { interval: 1000 }, async () => {
  try {
    delete require.cache[require.resolve(channelDataPath)];
    channelData = require(channelDataPath);

    setTimeout(() => {
      updateEmbeds();
    }, 500);
  } catch (error) {
    console.error("❌ Error recargando channelData.js:", error);
  }
});

// ========== EVENTO READY ==========
client.once("ready", async () => {
  await actualizarTasasDeCambio();

  cron.schedule("0 0 * * *", async () => {
    await actualizarTasasDeCambio();
  });

  const commands = [];
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    }
  }

  try {
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN,
    );
    const GUILD_ID = process.env.GUILD_ID;

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID),
      { body: commands },
    );
  } catch (error) {
    console.error("❌ Error registrando comandos:", error);
  }

  cron.schedule("0 * * * *", () => {
    checkInactiveTickets(client);
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TODOS LOS SISTEMAS INICIADOS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `   ${commandFiles.length} Comandos | ${eventFiles.length} Eventos`,
  );
  console.log("   Tasas de Cambio (actualización diaria)");
  console.log("   Sistema de Tickets e Inactividad");
  console.log("   Reportes Mensuales Automáticos");
  console.log("   Sistema de Reacciones para Soporte");
  console.log("   Sistema de Recarga de Comandos/Eventos");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  startFeedbackServer(client);
});

client.login(process.env.DISCORD_TOKEN);
