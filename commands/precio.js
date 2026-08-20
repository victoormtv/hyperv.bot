const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
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
    .setName("precio")
    .setDescription("Muestra los precios de productos de HyperV Store")
    .addStringOption((option) =>
      option
        .setName("producto")
        .setDescription("Selecciona el producto")
        .setRequired(true)
        .addChoices(
          { name: "Panel Full", value: "panel-full" },
          { name: "Panel Secure", value: "panel-secure" },
          { name: "Panel Only Aimbot", value: "panel-aimbot" },
          { name: "Bypass APK", value: "bypass-apk" },
          { name: "Bypass UID", value: "bypass-uid" },
          { name: "Bypass Global", value: "bypass-global" },
          { name: "Panel Android", value: "panel-android" },
          { name: "Menu Chams ESP", value: "menu-chams" },
          { name: "Panel iOS", value: "panel-ios" },
          { name: "Aimbot Body iOS", value: "aimbot-ios" },
          { name: "AimLock", value: "aimlock" },
          { name: "Regedit", value: "regedit" },
          { name: "Aimbot Color (Valorant)", value: "aimbot-valorant" },
          { name: "Spoofer (Valorant)", value: "spoofer-valorant" },
          { name: "Boost Rank (Valorant)", value: "boost-rank-valorant" },
          { name: "Panel CSGO", value: "panel-csgo" },
          { name: "Panel COD iOS", value: "panel-cod-ios" },
          { name: "Panel Warzone", value: "panel-warzone" },
          { name: "Discord Tools", value: "discord-tools" },
          { name: "Menu Chams BloodStrike", value: "chams-bloodstrike" },
          { name: "Aimbot Body Android", value: "aimbot-body-android" },
          { name: "Aimbot Proxy", value: "aimbot-proxy" },
        ),
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

    const precios = {
      "panel-full": {
        nombre: "Panel Full",
        descripcion:
          "Panel completo con todas las funciones sin restricciones para Free Fire Emulador",
        planes: [
          { duracion: "- Semanal", precio: "$25.00 | S./ 60.00" },
          { duracion: "- Mensual", precio: "$40.00 | S./ 110.00" },
          { duracion: "- Trimestral", precio: "$50.00 | S./ 150.00" },
          { duracion: "- Anual", precio: "$65.00 | S./ 200.00" },
        ],
        features: [
          "- Aimbots externals: Neck y Leggit",
          "- Aimbot Rage sin bug",
          "- Aimbot Helper sin bug",
          "- Aimbot Silent",
          "- ESP/Chams",
          "- Teletransportacion",
          "- Speed y WallHack",
          "- Actualizaciones y soporte incluido",
        ],
        imagen: "https://i.ibb.co/kVvRZ8J4/PANEL-FULL-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/panel-full",
        color: config.embedColor,
      },

      "panel-secure": {
        nombre: "Panel Secure",
        descripcion:
          "Panel basico con las funciones escenciales para Free Fire Emulador",
        planes: [
          { duracion: "- Semanal", precio: "$11.00 | S./ 40.00" },
          { duracion: "- Mensual", precio: "$23.00 | S./ 80.00" },
          { duracion: "- Trimestral", precio: "$32.00 | S./ 120.00" },
          { duracion: "- Anual", precio: "$40.00 | S./ 150.00" },
        ],
        features: [
          "- Aimbots external",
          "- Chams",
          "- Fix Lag",
          "- Actualizaciones y soporte incluido",
        ],
        imagen: "https://i.ibb.co/wF7k65bP/PANEL-SECURE-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/panel-secure",
        color: config.embedColor,
      },

      "panel-aimbot": {
        nombre: "Panel Only Aimbot",
        descripcion: "Panel especializado solo en Aimbot para Free Fire",
        planes: [
          { duracion: "- Semanal", precio: "$6.00 | S./ 20.00" },
          { duracion: "- Mensual", precio: "$15.00 | S./ 55.00" },
          { duracion: "- Trimestral", precio: "$25.00 | S./ 90.00" },
          { duracion: "- Anual", precio: "$30.00 | S./ 130.00" },
        ],
        features: [
          "- Aimbot External: Neck y Leggit",
          "- Fix Lag",
          "- Actualizaciones y soporte incluido",
        ],
        imagen: "https://i.ibb.co/6ctT7jFp/ONLY-AIMBOT-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/panel-only-aimbot",
        color: config.embedColor,
      },

      "bypass-apk": {
        nombre: "Bypass APK",
        descripcion: "Bypass para PC - Empareja con 50 jugadores",
        planes: [
          { duracion: "- Semanal", precio: "$15.00 | S./ 60.00" },
          { duracion: "- Mensual", precio: "$35.00 | S./ 130.00" },
        ],
        features: [
          "- Indetectable",
          "- Activacion Rapida",
          "- Sin riesgo de black/ban",
          "- Actualizaciones y soporte incluido",
        ],
        imagen: "https://i.ibb.co/5gjrJZ7Y/BYPASS-APK-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/bypass-apk",
        color: config.embedColor,
      },

      "bypass-uid": {
        nombre: "Bypass UID",
        descripcion: "Bypass vinculado a tu cuenta de Free Fire",
        planes: [
          { duracion: "- Semanal", precio: "$10.00 | S./ 35.00" },
          { duracion: "- 14 dias", precio: "$20.00 | S./ 50.00" },
          { duracion: "- Mensual", precio: "$30.00 | S./ 100.00" },
          { duracion: "- Trimestral", precio: "$45.00 | S./ 150.00" },
          { duracion: "- Anual", precio: "$60.00 | S./ 200.00" },
        ],
        features: [
          "- Indetectable",
          "- Activacion Rapida",
          "- Sin riesgo de black/ban",
          "- Actualizaciones y soporte incluido",
        ],
        imagen: "https://i.ibb.co/kgbggbdd/BYPASS-UID-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/bypass-uid",
        color: config.embedColor,
      },

      "bypass-global": {
        nombre: "Bypass Global",
        descripcion: "Bypass global vinculado a tu cuenta de Free Fire",
        planes: [
          { duracion: "- 1 dia", precio: "$3.00 | S./ 10.00" },
          { duracion: "- Semanal", precio: "$9.00 | S./ 30.00" },
          { duracion: "- 14 dias", precio: "$14.00 | S./ 50.00" },
          { duracion: "- Mensual", precio: "$40.00 | S./ 100.00" },
        ],
        features: [
          "- Indetectable",
          "- Activacion Rapida",
          "- Sin riesgo de black/ban",
          "- Actualizaciones y soporte incluido",
        ],
        imagen: "https://i.ibb.co/q3LTLgf5/bypass-global.jpg",
        link: "https://hyperv.online/products/bypass-global",
        color: config.embedColor,
      },

      "menu-chams": {
        nombre: "Menu Chams ESP",
        descripcion: "Menú de Chams y ESP para Free Fire Emulador",
        planes: [
          { duracion: "- Semanal", precio: "$5.00 | S./ 25.00" },
          { duracion: "- Mensual", precio: "$15.00 | S./ 50.00" },
          { duracion: "- Trimestral", precio: "$20.00 | S./ 70.00" },
          { duracion: "- Anual", precio: "$25.00 | S./ 90.00" },
        ],
        features: [
          "- Box ESP",
          "- Skeleton ESP",
          "- Distance",
          "- Colores personalizables",
          "- Health ESP",
        ],
        imagen: "https://i.ibb.co/TBzmmY39/MENU-CHAMS-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/menu-chams",
        color: config.embedColor,
      },

      "panel-ios": {
        nombre: "Panel iOS",
        descripcion: "Panel compatible con dispositivos iOS",
        planes: [
          { duracion: "- 24 horas", precio: "$10.00 | S/. 35.00" },
          { duracion: "- 1 semana", precio: "$25.00 | S/. 85.00" },
          { duracion: "- 1 mes", precio: "$45.00 | S/. 160.00" },
        ],
        features: [
          "- Sin jailbreak",
          "- Fácil instalación",
          "- Certificado GBOX",
          "- iOS 14+",
        ],
        imagen: "https://i.ibb.co/Xr6yMDrF/PANEL-IOS-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/panel-ios",
        color: config.embedColor,
      },

      "panel-android": {
        nombre: "Panel Android",
        descripcion: "Panel compatible con dispositivos Android",
        planes: [
          { duracion: "- Semanal", precio: "$10.00 | S/. 35.00" },
          { duracion: "- 14 dias", precio: "$17.00 | S/. 60.00" },
          { duracion: "- 1 mes", precio: "$30.00 | S/. 100.00" },
          { duracion: "- 60 dias", precio: "$45.00 | S/. 150.00" },
        ],
        features: [
          "- Tricks",
          "- Hologramas",
          "- Misc",
          "- Todas las versiones de Android",
        ],
        imagen: "https://i.ibb.co/tpb4HbrK/PANEL-ANDROID-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/panel-android",
        color: config.embedColor,
      },

      "aimbot-body-android": {
        nombre: "Aimbot Body Android",
        descripcion: "Aimbot especializado para Android - Apunta al pecho",
        planes: [
          { duracion: "- Por Temporada", precio: "$40.00 | S/. 140.00" },
        ],
        features: [
          "- Aimbot al pecho",
          "- Alta precisión",
          "- Sin bugs de daño",
          "- Compatible con Xiaomi",
        ],
        imagen: "https://i.ibb.co/Zkh6PB2/AIMBOT-PECHO-1.png",
        link: "https://hyperv.online/products/aimbot-body-android",
        color: config.embedColor,
      },

      "aimbot-proxy": {
        nombre: "Aimbot Proxy",
        descripcion: "Aimbot especializado para iOS - Apunta al pecho",
        planes: [
          { duracion: "- 1 semana", precio: "$25.00 | S/. 85.00" },
          { duracion: "- 1 mes", precio: "$55.00 | S/. 190.00" },
        ],
        features: ["- 120 FPS", "- Bypass relogin", "- Aimdrag"],
        imagen: "https://i.ibb.co/mrMTB6GD/AIMBOT-PROXY-1.png",
        link: "https://hyperv.online/products/aimbot-proxy",
        color: config.embedColor,
      },

      "aimbot-ios": {
        nombre: "Aimbot Body iOS",
        descripcion: "Aimbot especializado para iOS - Apunta al pecho",
        planes: [
          { duracion: "- Por Temporada", precio: "$65.00 | S/. 200.00" },
        ],
        features: [
          "- Aimbot al pecho",
          "- Alta precisión",
          "- Sin bugs de daño",
          "- Sin jailbreak",
        ],
        link: "https://hyperv.online/products/aimbot-body-ios",
        color: config.embedColor,
      },

      aimlock: {
        nombre: "AimLock",
        descripcion: "Sistema de puntería asistida para iOS y Android",
        planes: [{ duracion: "- Anual", precio: "$50.00 | S/. 180.00" }],
        features: [
          "- Facil instalacion",
          "- Sin bugs de daño",
          "- iOS y Android",
          "- Sin jailbreak",
        ],
        imagen: "https://i.ibb.co/TDw0gPbw/AIMLOCK-IOS-HYPER-V.png",
        link: "https://hyperv.online/products/aimlock",
        color: config.embedColor,
      },

      regedit: {
        nombre: "Regedit",
        descripcion: "Editor de registro optimizado para iOS & Android",
        planes: [
          { duracion: "- Mensual", precio: "$25.00 | S/. 80.00" },
          { duracion: "- Anual", precio: "$35.00 | S/. 130.00" },
        ],
        features: [
          "- Corrije la mira",
          "- Archivos indetectables",
          "- Preset incluido",
          "- Fácil de usar",
        ],
        imagen: "https://i.ibb.co/k2ZvPzxF/REGEDIT-PORTADA-HYPER-V.png",
        link: "https://hyperv.online/products/regedit",
        color: config.embedColor,
      },

      "aimbot-valorant": {
        nombre: "Aimbot Color (Valorant)",
        descripcion: "Aimbot basado en colores para Valorant",
        planes: [
          { duracion: "- Semanal", precio: "$15.00 | S./ 60.00" },
          { duracion: "- Mensual", precio: "$35.00 | S./ 110.00" },
          { duracion: "- Trimestral", precio: "$65.00 | S./ 220.00" },
        ],
        features: [
          "- Detección por color",
          "- FOV ajustable",
          "- Actualizaciones frecuentes",
          "- TriggerBot",
        ],
        imagen: "https://i.ibb.co/G4y2b2N0/AIMBOT-COLOR-VALORANT-1.png",
        link: "https://hyperv.online/products/aimbot-valorant",
        color: config.embedColor,
      },

      "spoofer-valorant": {
        nombre: "Spoofer (Valorant)",
        descripcion: "Quita el ban HWID",
        planes: [{ duracion: "- Permanente", precio: "$50.00 | S/. 180.00" }],
        features: ["- Desbanea por placa", "- 100% Efectivo"],
        link: "https://hyperv.online/products/spoofer",
        color: config.embedColor,
      },

      "boost-rank-valorant": {
        nombre: "Boost Rank (Valorant)",
        descripcion: "Boost para subir de rank en Valorant",
        planes: [{ duracion: "- A consultar", precio: "A consultar" }],
        features: ["- Sube de nivel", "- 100% Efectivo"],
        link: "https://hyperv.online/products/boost-rank",
        color: config.embedColor,
      },

      "panel-warzone": {
        nombre: "Panel Warzone",
        descripcion:
          "Panel completo con todas las funciones sin restricciones para Warzone",
        planes: [
          { duracion: "- 15 dias", precio: "$30.00 | S/. 110.00" },
          { duracion: "- Mensual", precio: "$65.00 | S/. 200.00" },
        ],
        features: ["- Aimbot", "- Triggerbot", "- FOV", "- ESP"],
        link: "https://hyperv.online/products/panel-warzone",
        color: config.embedColor,
      },

      "chams-bloodstrike": {
        nombre: "Menu Chams Bloodstrike",
        descripcion:
          "Menu completo con todas las funciones sin restricciones para Bloodstrike",
        planes: [
          { duracion: "- Semanal", precio: "$12.00 | S/. 40.00" },
          { duracion: "- Mensual", precio: "$30.00 | S/. 100.00" },
          { duracion: "- Trimestral", precio: "$40.00 | S/. 140.00" },
        ],
        imagen: "https://i.ibb.co/PvzmVcGx/CHAMS-BLOOD.png",
        features: [
          "- Chams",
          "- ESP",
          "- Stream Spoof",
          "- All mices compatible",
        ],
        link: "https://hyperv.online/products/menu-chams-bloodstrike",
        color: config.embedColor,
      },

      "panel-csgo": {
        nombre: "Panel CSGO",
        descripcion:
          "Panel completo con todas las funciones sin restricciones para CSGO",
        planes: [
          { duracion: "- Semanal", precio: "$20.00 | S/. 70.00" },
          { duracion: "- Mensual", precio: "$45.00 | S/. 160.00" },
        ],
        features: ["- Aimbot", "- Triggerbot", "- FOV", "- ESP"],
        link: "https://hyperv.online/products/panel-csgo",
        color: config.embedColor,
      },

      "panel-cod-ios": {
        nombre: "Panel COD iOS",
        descripcion:
          "Panel completo con todas las funciones sin restricciones para COD iOS",
        planes: [
          { duracion: "- 1 dia", precio: "$15.00 | S/. 50.00" },
          { duracion: "- Semanal", precio: "$30.00 | S/. 100.00" },
          { duracion: "- Mensual", precio: "$50.00 | S/. 170.00" },
        ],
        features: ["- Aimbot", "- Triggerbot", "- FOV", "- ESP"],
        link: "https://hyperv.online/products/panel-cod-ios",
        color: config.embedColor,
      },

      "discord-tools": {
        nombre: "Discord Tools",
        descripcion: "Herramientas premium, boosteos y nitro para Discord",
        planes: [
          { duracion: "- 1000 Users Online", precio: "$12.00" },
          { duracion: "- 1000 Users Offline", precio: "$25.00" },
          { duracion: "- 7 Boost x1 mes", precio: "$15.00" },
          { duracion: "- 7 Boost x3 meses", precio: "$30.00" },
          { duracion: "- 14 Boost x1 mes", precio: "$30.00" },
          { duracion: "- 14 Boost x3 meses", precio: "$50.00" },
        ],
        features: [
          "- Members reales",
          "- Boosts permanentes",
          "- Nitro disponible",
          "- Entrega rápida",
        ],
        imagen: "https://i.ibb.co/XZn91S4y/DISCORD-TOOLS-HYPER-V.png",
        link: "https://hyperv.online/products/discord-tools",
        color: config.embedColor,
      },
    };

    const info = precios[producto];

    if (!info) {
      return await interaction.reply({
        content: "⚠️ Producto no encontrado.",
        flags: 64,
      });
    }

    const planesTexto = info.planes
      .map((p) => `${p.duracion}: ${p.precio}`)
      .join("\n");
    const featuresTexto = info.features.join("\n");

    const embed = new EmbedBuilder()
      .setTitle(info.nombre)
      .setDescription(info.descripcion)
      .addFields(
        { name: "__PLANES DISPONIBLES__", value: planesTexto, inline: false },
        { name: "__CARACTERISTICAS__", value: featuresTexto, inline: false },
      )
      .setColor(info.color)
      .setFooter(config.embedFooter)
      .setTimestamp();

    if (info.imagen) embed.setImage(info.imagen);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Comprar en la Web")
        .setStyle(ButtonStyle.Link)
        .setURL(info.link),
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
