const fs = require("fs");
const path = require("path");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const {
  createTicketButton,
  createLanguageTicketButtons,
} = require("../utils/ticketButtons");
const config = require("./config");
const ids = require("./ids");
const { roles } = require("./ids");

const liston = "<:linea:1432870878382653530>".repeat(22) + "\n\n";

const purchaseEmbed = new EmbedBuilder()
  .setDescription(
    "You can purchase directly on our website using Bitcoin, Paypal or Credit/Debit Card for **INSTANT DELIVERY**.\n" +
    "Puedes comprar directamente en nuestra página web usando Bitcoin, PayPal o Tarjeta de Crédito/Débito para recibir tu **PEDIDO AL INSTANTE**.\n\n" +
    "For other methods / Otros métodos: <#1466257895636209796>",
  )
  .setColor(0xffffff)
  .setFooter(config.embedFooter);

function createTicketAndStoreRow(ticketId, storeUrl) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(ticketId)
      .setLabel("Comprar en Ticket / Buy on Ticket")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji({ name: 'soporte', id: '1232042953908949034' }),
    new ButtonBuilder()
      .setLabel("Comprar en Web / Buy on Web")
      .setEmoji({ name: 'compra', id: '1316171968717918379' })
      .setStyle(ButtonStyle.Link)
      .setURL(storeUrl),
  );
}

module.exports = [
  {
    id: ids.embeds.WEBSITE,
    messageId: "1466257657550737591",
    embed: new EmbedBuilder()
      .setTitle("> Website")
      .setDescription(
        "Explora nuestra tienda oficial y descubre todos nuestros productos disponibles.\n\n" +
        "**Juegos destacados**\n\n" +
        "<:ff:1433261279979769856> Free Fire\n" +
        "<:valoo:1466276625480941774> Valorant\n" +
        "<:csgoo:1466276596787708016> CSGO\n" +
        "<:warzone:1466276557348929566> Call of Duty\n\n" +
        "<:garantia:1321973733971333150> Disfruta de una entrega inmediata y un Soporte 24/7 para asistirte en todo momento.\n" +
        "<:garantia:1321973733971333150> Contamos con Métodos de pago internacionales y nacionales para que puedas adquirir tus che4ts favoritos sin problemas.",
      )
      .setColor(config.embedColor)
      .setThumbnail(config.embedThumbnail)
      .setFooter(config.embedFooter)
      .setImage(config.defaultImage),
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Ir a la Tienda")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:website:1459019351410872362>")
          .setURL("https://hyperv.online"),
      ),
    ],
  },

  {
    id: ids.embeds.PAYMENT,
    messageId: "1466621230101561600",
    embed: new EmbedBuilder()
      .setTitle("> Métodos de Pago")
      .setDescription(
        "**Métodos Internacionales**\n\n" +
        "<:binance:1466284857742201104> Binance\n" +
        "<:paypal:1117992083765080144> PayPal\n" +
        "<:card:1466284819880083493> Credit Card\n" +
        "<:wester:1117992080912945222> Wester Union\n" +
        "<:remitly:1466284840000426099> Remitly\n\n" +
        "**Métodos Nacionales**\n\n" +
        "<:flagperu:1232045301813088277> BCP/Interbank/Yape/Plin\n" +
        "<:flagmexico:1244856813053284437> Spin (Depósitos)/Nubank (Transferencias)\n" +
        "<:flagcolombia:1232045292887605290> Nequi\n" +
        "<:flagchile:1232045290484404274> Banco Estado\n" +
        "<:flagargentina:1232045285241262251> Mercado Pago\n" +
        "<:flagbolivia:1232045288118550648> QR para depósitos y transferencias\n" +
        "<:ecuador:1232045296998023260> Pichincha\n" +
        "<:guatemala:1466596711701938196> BanRural\n" +
        "<:urugay:1466593083725582561> Prex\n" +
        "<:spain:1466586341134434441> Bizum\n" +
        "<:flagunitedstates:1232045303574827080> Zelle/CashApp\n",
      )
      .setColor(config.embedColor)
      .setThumbnail(config.embedThumbnail)
      .setFooter(config.embedFooter)
      .setImage(config.defaultImage),
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Check our products")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:compra:1316466484133757021>")
          .setURL(
            "https://discord.com/channels/1117932314102595716/1117935960852803696",
          ),
      ),
    ],
  },

  {
    id: ids.embeds.SOCIAL_NETWORKS,
    messageId: "1466621231108325548",
    embed: new EmbedBuilder()
      .setTitle("> Redes Sociales")
      .setDescription(
        "Síguenos en nuestras redes sociales, donde podrás estar al tanto de nuestras últimas novedades, promociones y contenido exclusivo.",
      )
      .setColor(config.embedColor)
      .setThumbnail(config.embedThumbnail)
      .setFooter(config.embedFooter)
      .setImage(config.defaultImage),
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Website")
          .setStyle(ButtonStyle.Link)
          .setEmoji("🌐")
          .setURL("https://hyperv.online"),
        new ButtonBuilder()
          .setLabel("Instagram")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:instagram36:1317355853182926939>")
          .setURL("https://www.instagram.com/hypervgg.pe/"),
        new ButtonBuilder()
          .setLabel("TikTok")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<a:987340874914619432:1118071042510954548>")
          .setURL("https://www.tiktok.com/@hypervgg"),
        new ButtonBuilder()
          .setLabel("YouTube")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:Youtube:1316608060675985468>")
          .setURL("https://www.youtube.com/@hyperggg"),
      ),
    ],
  },

  {
    id: ids.embeds.TICKET_GENERAL,
    messageId: "1466621231540342948",
    embed: new EmbedBuilder()
      .setTitle("> Ticket")
      .setDescription(
        "**Welcome to our support system!**\n" +
        "¡Bienvenido a nuestro sistema de soporte!\n\n" +
        "**Need help?** Open a ticket and our team will assist you.\n" +
        "**¿Necesitas ayuda?** Abre un ticket y nuestro equipo te ayudará.\n\n" +
        "**What we can help with / Con qué podemos ayudarte:**\n" +
        "`-` Product support and troubleshooting / Soporte de productos y resolución de problemas\n" +
        "`-` Purchase assistance / Asistencia con compras\n" +
        "`-` General questions / Preguntas generales\n" +
        "`-` Technical issues / Problemas técnicos\n\n" +
        "*Select your language below / Selecciona tu idioma abajo*",
      )
      .setColor(config.embedColor)
      .setThumbnail(config.embedThumbnail)
      .setFooter(config.embedFooter)
      .setImage(config.defaultImage),
    components: [createLanguageTicketButtons()],
  },

  {
    id: ids.embeds.PANEL_PC_GRATIS,
    messageId: "1509800525334319215",
    embed: new EmbedBuilder()
      .setTitle("> Panel Gratis")
      .setDescription(
        "**<:compra:1316171968717918379> Si deseas adquirir algún plan de paga o recurrir algun soporte gratuito, abre un ticket.**",
      )
      .setColor(config.embedColor)
      .setTimestamp()
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/TB9Z7y5X/panel-free.png"),
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("ticket_panel_gratis")  // <-- botón de ticket
          .setLabel("Abrir Ticket / Open Ticket")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji({ name: 'soporte', id: '1232042953908949034' }),
        new ButtonBuilder()
          .setLabel("Guia de Instalacion")
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: 'download', id: '1505630527535972402' })
          .setURL("https://hyperv.online/free/panel-free"),
        new ButtonBuilder()
          .setLabel("Instagram (Seguirnos obligatoriamente)")
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: 'instagram36', id: '1317355853182926939' })
          .setURL("https://www.instagram.com/hypervgg.pe/"),
        new ButtonBuilder()
          .setLabel("Grupo de Ventas")
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: 'wsp', id: '1459018687817322618' })
          .setURL("https://chat.whatsapp.com/DSjbG1vp4hnA6EaLRpeCQj"),
      ),
    ],
  },

  {
    id: ids.embeds.BYPASS_GRATIS,
    messageId: "1439158817488109709",
    embed: new EmbedBuilder()
      .setTitle("> Bypass UID Gratis")
      .setDescription(
        "**<:compra:1316171968717918379> Si deseas reclamar tu key, usa uno de los botones de abajo.**",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setTimestamp()
      .setImage("https://i.ibb.co/fYR0QN6P/bypass-free.png"),
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("ticket_bypass_free")
          .setLabel("Reclamar Key")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji({ name: 'soporte', id: '1316466482653171763' }),
        new ButtonBuilder()
          .setLabel("Guia de Instalacion")
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: 'download', id: '1505630527535972402' })
          .setURL("https://hyperv.online/free/bypass-free"),
        new ButtonBuilder()
          .setLabel("Instagram (Seguirnos obligatoriamente)")
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: 'instagram36', id: '1317355853182926939' })
          .setURL("https://www.instagram.com/hypervgg.pe/"),
        new ButtonBuilder()
          .setLabel("Grupo de Ventas")
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: 'wsp', id: '1459018687817322618' })
          .setURL("https://chat.whatsapp.com/DSjbG1vp4hnA6EaLRpeCQj"),
      ),
    ],
  },
  // ========================================
  // PANEL FULL
  // ========================================
  {
    id: ids.embeds.PANEL_FULL,
    messageId: "1466840122648559773",
    embed: new EmbedBuilder()
      .setTitle("> Panel Full")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Aimbot Memory**\n> Neck/Legit/Pecho\n" +
        "- **Aimbot Offsets**\n> Rage/Helper/Lock/Silent\n" +
        "- **Misc**\n> NoRecoil/FastReload/FakeDamage/MedikitFast\n" +
        "- **Extra**\n> OptionsVisionH4ck/Camera Supreme\n" +
        "- **Visuals - Chams**\n> 3D/Glow/Solido/MapHDR/RGB/Caracters\n" +
        "- **ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n" +
        "- **Fake Lag**\n> Flush/Ghost/Freeze/FreezeTimer\n" +
        "- **Functions Offsets**\n> MagnetEnemy/UnderShot/ClimbStructure/SpectateEnemy/UpPlayer/Teleport\n" +
        "- **WallH4ck Explo1ts**\n" +
        "- **Extra Functions**\n> FastFire/Levitate/Speed/360\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 25.00 | S/. 60.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 40.00 | S/. 110.00\n" +
        "<:garantia:1321973733971333150> Trimestral: $ 50.00 | S/. 150.00\n" +
        "<:garantia:1321973733971333150> Anual: $ 65.00 | S/. 200.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/kVvRZ8J4/PANEL-FULL-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_panel_full",
        "https://hyperv.online/products/panel-full",
      ),
    ],
  },

  // ========================================
  // PANEL SECURE
  // ========================================
  {
    id: ids.embeds.PANEL_BASIC,
    messageId: "1466862391395483700",
    embed: new EmbedBuilder()
      .setTitle("Panel Secure")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Aimbot Memory**\n> Neck/Legit\n" +
        "- **Visuals - Chams**\n> 3D/Glow/Solido/Wireframe/Oreon/Wukong-Naruto/RGB\n" +
        "- **Fake Lag**\n> Flush/Ghost/Freeze/FreezeTimer\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 11.00 | S/. 40.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 22.00 | S/. 80.00\n" +
        "<:garantia:1321973733971333150> Trimestral: $ 32.00 | S/. 120.00\n" +
        "<:garantia:1321973733971333150> Anual: $ 40.00 | S/. 150.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/wF7k65bP/PANEL-SECURE-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_panel_secure",
        "https://hyperv.online/products/panel-secure",
      ),
    ],
  },

  // ========================================
  // PANEL ONLY AIMBOT
  // ========================================
  {
    id: ids.embeds.PANEL_ONLY_AIMBOT,
    messageId: "1466862392259514442",
    embed: new EmbedBuilder()
      .setTitle("> Panel Only Aimbot")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Aimbot Memory**\n> Neck/Legit\n" +
        "- **Fake Lag**\n> Flush/Ghost/Freeze/FreezeTimer\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 6.00 | S/. 20.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 15.00 | S/. 55.00\n" +
        "<:garantia:1321973733971333150> Trimestral: $ 25.00 | S/. 90.00\n" +
        "<:garantia:1321973733971333150> Anual: $ 30.00 | S/. 130.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/6ctT7jFp/ONLY-AIMBOT-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_panel_only_aimbot",
        "https://hyperv.online/products/panel-only-aimbot",
      ),
    ],
  },

  // ========================================
  // CHAMS PC
  // ========================================
  {
    id: ids.embeds.CHAMS_PC,
    messageId: "1466862392922083368",
    embed: new EmbedBuilder()
      .setTitle("> Menu Chams")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Visuals - Chams**\n> 3D/Glow/Solido/Wireframe/Oreon/Wukong-Wukong Naruto/RGB\n" +
        "- **ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 5.00 | S/. 25.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 15.00 | S/. 50.00\n" +
        "<:garantia:1321973733971333150> Trimestral: $ 20.00 | S/. 70.00\n" +
        "<:garantia:1321973733971333150> Anual: $ 25.00 | S/. 90.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/TBzmmY39/MENU-CHAMS-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_chams",
        "https://hyperv.online/products/menu-chams",
      ),
    ],
  },

  // ========================================
  // BYPASS ID
  // ========================================
  {
    id: ids.embeds.BYPASS_ID,
    messageId: "1530103411578765375",
    embed: new EmbedBuilder()
      .setTitle("> Bypass UID")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Bypass Emulador**\n" +
        "> 64 Bits\n" +
        "- **Bluestacks and MSI compatibility**\n- **Good FPS**\n- **Proxy and ID Injection**\n- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> 1 dia: $ 3.00 | S/. 10.00\n" +
        "<:garantia:1321973733971333150> Semanal: $ 9.00 | S/. 30.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 30.00 | S/. 90.00\n" +
        "<:garantia:1321973733971333150> Trimestral: $ 40.00 | S/. 140.00\n" +
        "<:garantia:1321973733971333150> Anual: $ 60.00 | S/. 190.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/kgbggbdd/BYPASS-UID-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_bypass_id",
        "https://hyperv.online/products/bypass-uid",
      ),
    ],
  },

  // ========================================
  // BYPASS GLOBAL
  // ========================================
  {
    id: ids.embeds.BYPASS_GLOBAL,
    messageId: "1458125700199350354",
    embed: new EmbedBuilder()
      .setTitle("> Bypass Global")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Bypass Emulador**\n" +
        "> 64 Bits\n" +
        "- **Bluestacks and MSI compatibility**\n- **Good FPS**\n- **Proxy and ID Injection**\n- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> 1 Dia: $ 3.00 | S/. 10.00\n" +
        "<:garantia:1321973733971333150> Semanal: $ 9.00 | S/. 30.00\n" +
        "<:garantia:1321973733971333150> 14 Dias:  $ 14.00 | S/. 50.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 40.00 | S/. 100.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/q3LTLgf5/bypass-global.jpg"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_bypass_global",
        "https://hyperv.online/products/bypass-global",
      ),
    ],
  },

  // ========================================
  // BYPASS APK
  // ========================================
  {
    id: ids.embeds.BYPASS_APK,
    messageId: "1458125701185015830",
    embed: new EmbedBuilder()
      .setTitle("> Bypass APK")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Bypass Emulador**\n> 64Bits\n" +
        "- **Bluestacks and MSI compatibility**\n- **Good FPS**\n- **APK Injection**\n- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 15.00 | S/. 60.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 35.00 | S/. 130.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/5gjrJZ7Y/BYPASS-APK-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_bypass_apk",
        "https://hyperv.online/products/bypass-apk",
      ),
    ],
  },

  // ========================================
  // PANEL IOS
  // ========================================
  {
    id: ids.embeds.PANEL_IOS,
    messageId: "1483312515629973565",
    embed: new EmbedBuilder()
      .setTitle("> Panel iOS")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Aimbot**\n> Head/Neck/Assist/Cycle/Silent/AimKill\n" +
        "- **ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n" +
        "- **Misc**\n> NoRecoil/BackJump/InvertedWall/\n" +
        "- **Stream Mode**\n- **No need JailBreak**\n- **No need computer to install**\n- **Includes Gbox certificate**\n- **Compatible with all iOS Versions**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> 1 dia: $ 10.00 | S/. 35.00\n" +
        "<:garantia:1321973733971333150> Semanal: $ 25.00 | S/. 85.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 45.00 | S/. 160.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/Xr6yMDrF/PANEL-IOS-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_panel_ios",
        "https://hyperv.online/products/panel-ios",
      ),
    ],
  },

  // ========================================
  // AIMBOT BODY IOS
  // ========================================
  {
    id: ids.embeds.AIMBOT_BODY_IOS,
    messageId: "1436783769813123165",
    embed: new EmbedBuilder()
      .setTitle("> Aimbot Body")
      .setDescription(
        "Presentamos nuestro nuevo Aimbot Body mediante Jailbreak, obtendrás una victoria asegurada sin bug de daño en tu dispositivo iOS.\n\n" +
        "**FUNCIONES**\n" +
        "`-` Soporte Sistema: iOS\n`-` Soporte Versión del sistema: Todas\n`-` Soporte Idiomas: Inglés/Español/Portugués\n\n" +
        "**PRICES**\n" +
        "<:garantia:1321973733971333150> Por Temporada: $ 50.00 | S/. 180.00\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/fY5MmBNq/AIMBOT-IOS-BODY-1.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_aimbot_body_ios",
        "https://hyperv.online/products/aimbot-body-ios",
      ),
    ],
  },

  // ========================================
  // PANEL ANDROID
  // ========================================
  {
    id: ids.embeds.PANEL_ANDROID,
    messageId: "1454537233662087323",
    embed: new EmbedBuilder()
      .setTitle("> Panel Android")
      .setDescription(
        "**FUNCIONES:**\n" +
        "- **Trick**\n> Aimtrick/AimLegit/ShowFov/TypeOfRegedit\n" +
        "- **Helper**\n> CalibrateSensitivity/HeadTrick/Aimlock/Holograma\n" +
        "- **Misc**\n> Background/Liners/TextViews/Linear/ImageView/Button\n" +
        "- **Settings**\n> SaveConfig/ResetConfig/HideIcon/ShowIcon/DeleteCheats/Bypass\n" +
        "- **Optim**\n> DisableGApps/DisableAll/DisableOther/FixInputLag\n" +
        "- **Compatible with all Android Versions**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 10.00 | S/. 35.00\n" +
        "<:garantia:1321973733971333150> 14 dias: $ 17.00 | S/. 60.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 30.00 | S/. 100.00\n" +
        "<:garantia:1321973733971333150> 60 dias: $ 45.00 | S/. 150.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/tpb4HbrK/PANEL-ANDROID-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_panel_android",
        "https://hyperv.online/products/panel-android",
      ),
    ],
  },

  // ========================================
  // AIMBOT BODY ANDROID
  // ========================================
  {
    id: ids.embeds.AIMBOT_BODY_ANDROID,
    messageId: "1454537233662087323",
    embed: new EmbedBuilder()
      .setTitle("> Aimbot Body Android")
      .setDescription(
        "**FUNCIONES:**\n- **Aimbot**\n> Body\n\n**Compatible con dispositivos Xiaomi**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Por Temporada: $ 40.00 | S/. 140.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/Zkh6PB2/AIMBOT-PECHO-1.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_aimbot_body_android",
        "https://hyperv.online/products/aimbot-body-android",
      ),
    ],
  },

  // ========================================
  // AIMBOT PROXY
  // ========================================
  {
    id: ids.embeds.AIMBOT_PROXY,
    messageId: "1486896241546629251",
    embed: new EmbedBuilder()
      .setTitle("> Aimbot Proxy")
      .setDescription(
        "**FUNCIONES**\n- **120 FPS**\n- **Bypass relogin**\n- **Aimdrag**\n- **Aimbot Pecho**\n- **Hologramas Avatar**\n- **Hologramas Armas**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 25.00 | S/. 85.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 55.00 | S/. 190.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/mrMTB6GD/AIMBOT-PROXY-1.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_aimbot_proxy",
        "https://hyperv.online/products/aimbot-proxy",
      ),
    ],
  },

  // ========================================
  // AIMLOCK
  // ========================================
  {
    id: ids.embeds.AIMLOCK,
    messageId: "1275684915320590336",
    embed: new EmbedBuilder()
      .setTitle("> Aimlock")
      .setDescription(
        "**FUNCIONES**\n- **Assist**\n> Aimlock/AimTrick\n- **Misc**\n> NoFakeDamage\n" +
        "- **No need JailBreak**\n- **No need Phone reset**\n- **No need computer to install**\n- **Compatible with all iOS Versions**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Anual: $ 50.00 | S/. 180.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/TDw0gPbw/AIMLOCK-IOS-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_aimlock",
        "https://hyperv.online/products/aimlock",
      ),
    ],
  },

  // ========================================
  // REGEDIT
  // ========================================
  {
    id: ids.embeds.REGEDIT,
    messageId: "1117935996449857647",
    embed: new EmbedBuilder()
      .setTitle("> Regedit")
      .setDescription(
        "Nuestro regedit te ofrece corregir la mira perfectamente.\n\n" +
        "**FUNCIONES**\n`-` Soporte Sistema: Android\n`-` Soporte Versión del sistema: Todas\n`-` Soporte Idiomas: Inglés/Español/Portugués\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Mensual: $ 25.00 | S/. 80.00\n" +
        "<:garantia:1321973733971333150> Anual: $ 35.00 | S/. 130.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/k2ZvPzxF/REGEDIT-PORTADA-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_regedit",
        "https://hyperv.online/products/regedit",
      ),
    ],
  },

  // ========================================
  // AIMBOT COLOR - VALORANT
  // ========================================
  {
    id: "1399913608283951325",
    messageId: "1430729753526272114",
    embed: new EmbedBuilder()
      .setTitle("> Aimbot Color")
      .setDescription(
        "**FUNCIONES**\n- **Aimbot**\n> Hold/Toogle mode\n- **Trigger Bot**\n- **Recoil Control**\n- **Insta Locker**\n- **Match Info**\n> Reveal players name and rank\n- **Mobile Control**\n- **All mices compatible**\n- **Windows 10 & 11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 15.00 | S/. 60.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 35.00 | S/. 110.00\n" +
        "<:garantia:1321973733971333150> Trimestral: $ 65.00 | S/. 220.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/G4y2b2N0/AIMBOT-COLOR-VALORANT-1.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_aimbot_color",
        "https://hyperv.online/products/aimbot-color",
      ),
    ],
  },

  // ========================================
  // SPOOFER
  // ========================================
  {
    id: ids.embeds.SPOOFER,
    messageId: "1306875141015212093",
    embed: new EmbedBuilder()
      .setTitle("> Spoofer")
      .setDescription(
        "Nuestro Spoofer te ayudará a falsificar las características del HWID.\n\n" +
        "__**SOPORTE:**__\n`-` Fortnite\n`-` Rust\n`-` Apex\n`-` Dayz\n`-` Valorant\n\n" +
        "**PRECIO:**\n" +
        "<:garantia:1321973733971333150> Permanente: $ 50.00 | S/. 180.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/JW2MWvtB/SPOOFER-VALORANT-HYPER-V-1.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_spoofer",
        "https://hyperv.online/products/spoofer",
      ),
    ],
  },

  // ========================================
  // BOOST RANK
  // ========================================
  {
    id: ids.embeds.BOOST_RANK,
    messageId: "1360496293621006336",
    embed: new EmbedBuilder()
      .setTitle("> Boost Rank")
      .setDescription(
        "**¿Estás listo para dejar atrás tus límites actuales?**\n" +
        "Ofrecemos servicios de boosteo personalizados en Valorant.\n\n" +
        "**¿Qué Ofrecemos?**\n" +
        "**Boosteo Personalizado:** Escoge el rango al que deseas llegar.\n" +
        "**Total Seguridad:** Tu cuenta estará protegida.\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/F4HdZyW5/BOOST-RANK-VALORANT-HYP.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_boost_rank",
        "https://hyperv.online/products/boost-rank",
      ),
    ],
  },

  // ========================================
  // PANEL CSGO
  // ========================================
  {
    id: ids.embeds.PANEL_CSGO,
    messageId: "1454143472738238545",
    embed: new EmbedBuilder()
      .setTitle("> Panel CSGO")
      .setDescription(
        "**Descubre nuestro nuevo panel de CSGO2**.\n\n" +
        "**FUNCIONES**\n`-` Soporte Windows: 8/10/11\n`-` Soporte CPU: Intel/AMD/Xeon\n`-` Soporte Idiomas: Inglés/Español/Portugués\n" +
        "**PRECIOS**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 20.00 | S/. 70.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 45.00 | S/. 160.00\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage(
        "https://media.discordapp.net/attachments/1231110235171586138/1464694955078586520/cs2_hyper_v_1.png?ex=697666fa&is=6975157a&hm=c361074bddb145f5468cb13a51bf3301205e045cb5244abc05c1475e4035900d&=&format=webp&quality=lossless&width=1521&height=856",
      ),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_panel_csgo",
        "https://hyperv.online/products/panel-csgo",
      ),
    ],
  },

  // ========================================
  // PANEL COD IOS
  // ========================================
  {
    id: ids.embeds.PANEL_COD_IOS,
    messageId: "1454149809329012947",
    embed: new EmbedBuilder()
      .setTitle("> Panel COD iOS")
      .setDescription(
        "**FUNCIONES**\n- **Aimbot**\n> Head/Neck/Assist/Cycle/Silent/AimKill\n**ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n**Misc**\n> NoRecoil/BackJump/InvertedWall/\n\n" +
        "**PRECIOS**\n" +
        "<:garantia:1321973733971333150> x1 dia: $ 15.00 | S/. 50.00\n" +
        "<:garantia:1321973733971333150> Semanal: $ 30.00 | S/. 100.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 50.00 | S/. 170.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/67hyVH0M/COD-HYPER-V-1.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_panel_cod_ios",
        "https://hyperv.online/products/panel-cod-ios",
      ),
    ],
  },

  // ========================================
  // PANEL WARZONE
  // ========================================
  {
    id: ids.embeds.PANEL_WARZONE,
    messageId: "1402843190184382515",
    embed: new EmbedBuilder()
      .setTitle("> Panel Warzone")
      .setDescription(
        "Panel Warzone — compatible con Xbox, Steam y BattleNet.\n\n" +
        "**FUNCIONES**\n`-` Compatibilidad: Xbox, Steam, BattleNet\n`-` Soporte Windows: 8/10/11\n`-` Soporte CPU: Intel/AMD/Xeon\n`-` Soporte Idiomas: Inglés/Español/Portugués\n" +
        "**PRECIOS**\n" +
        "<:garantia:1321973733971333150> 15 dias: $ 30.00 | S/. 110.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 65.00 | S/. 200.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/DDxCgMp4/WARZONE-HYPER-V-1.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_panel_warzone",
        "https://hyperv.online/products/panbel-warzone",
      ),
    ],
  },

  // ========================================
  // CHAMS BLOODSTRIKE
  // ========================================
  {
    id: ids.embeds.CHAMS_BLOODSTRIKE,
    messageId: "1476269296752660571",
    embed: new EmbedBuilder()
      .setTitle("> Menu Chams Bloodstrike")
      .setDescription(
        "**FUNCIONES:**\n- **Visuals - Chams**\n> 3D/Glow/Solido/Wireframe/Oreon/Wukong Naruto/RGB\n- **ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**\n\n" +
        "**PRECIOS:**\n" +
        "<:garantia:1321973733971333150> Semanal: $ 12.00 | S/. 40.00\n" +
        "<:garantia:1321973733971333150> Mensual: $ 30.00 | S/. 100.00\n" +
        "<:garantia:1321973733971333150> Trimestral: $ 40.00 | S/. 140.00\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/PvzmVcGx/CHAMS-BLOOD.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_chams_bloodstrike",
        "https://hyperv.online/products/menu-chams-bloodstrike",
      ),
    ],
  },

  // ========================================
  // NITRO & BOOSTER
  // ========================================
  {
    id: ids.embeds.NITRO,
    messageId: "1316566411036065792",
    embed: new EmbedBuilder()
      .setTitle("> Discord Nitro & Booster")
      .setDescription(
        "¿Quieres disfrutar de Discord Nitro o mejorar tu servidor con boosts?\n\n" +
        "**PRECIOS**\n" +
        "<:garantia:1321973733971333150> 6 boosts x1 mes: $ 7.00 | S/. 25.00\n" +
        "<:garantia:1321973733971333150> 6 boosts x3 meses: $ 12.00 | S/. 45.00\n" +
        "<:garantia:1321973733971333150> 14 boosts x1 mes: $ 12.00 | S/. 45.00\n" +
        "<:garantia:1321973733971333150> 14 boosts x3 meses: $ 20.00 | S/. 70.00\n" +
        "<:garantia:1321973733971333150> 30 boosts x1 meses: $ 20.00 | S/. 75.00\n" +
        "<:garantia:1321973733971333150> 30 boosts x3 mes: $ 40.00 | S/. 140.00\n" +
        "<:garantia:1321973733971333150> 1000 users online: $ 12.00 | S/. 40.00\n" +
        "<:garantia:1321973733971333150> 1000 users offline: $ 25.00 | S/. 80.00\n\n" +
        liston,
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage("https://i.ibb.co/XZn91S4y/DISCORD-TOOLS-HYPER-V.png"),
    extraEmbeds: [purchaseEmbed],
    components: [
      createTicketAndStoreRow(
        "ticket_nitro_booster",
        "https://hyperv.online/products/discord-tools",
      ),
    ],
  },

  // ========================================
  // INFO COMANDOS
  // ========================================
  {
    id: ids.embeds.INFO_COMANDOS,
    messageId: "1455736867944402984",
    embed: new EmbedBuilder()
      .setTitle("> Comandos")
      .setDescription(
        "Lista completa de comandos disponibles para el equipo de ventas y soporte.\n\n" +
        "**Gestión de ventas:**\n- `/venta` - Registrar ventas de cualquier producto.\n- `/upgrade` - Cambiar o mejorar productos pagando la diferencia.\n- `/gracias` - Informar al cliente que su compra fue efectiva.\n- `/pago` - Crea un link para realizar la compra mediante Mercado Pago.\n- `/propina` - Registrar propinas de cualquier metodo de pago.\n- `/eliminar-venta` Eliminar ventas mal ingresadas.\n\n" +
        "**Información de productos:**\n- `/precio` - Listar precios y características de productos.\n- `/link` - Mostrar enlace directo de un producto de la tienda.\n- `/instalacion` - Pasos y requisitos para instalación de productos PC.\n\n" +
        "**Carrito de compras:**\n- `/carrito` - Agregar productos al carrito web del cliente\n\n" +
        "**Métodos de pago:**\n- `/metodos` - Listar métodos de pago por país\n- `/datos` - Mostrar datos de métodos de pago específicos\n" +
        "**Administración:**\n- `/reporte-mensual` - Generar Excel de comisiones mensuales\n- `/embed` - Genera un embed facil y rapido.\n- `/info` - Muestra informacion del bot\n- `/limpiar` - Elimina todos los embeds de los canales.\n",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter),
  },

  // ========================================
  // COMISIONES INFO
  // ========================================
  {
    id: ids.embeds.BOT,
    messageId: "1455736868577226863",
    embed: new EmbedBuilder()
      .setTitle("> Sistema de Comisiones")
      .setDescription(
        "**Sistema automatizado de gestión de ventas y comisiones**\n\n" +
        "**Registro de ventas:**\n- Comando `/venta` con autocompletado de productos.\n- Registro automático en base de datos.\n- Asignación inmediata al vendedor.\n\n" +
        "**Notificaciones automáticas:**\n- Recordatorios: 10 minutos inicial, luego cada hora.\n- Bloqueo automático tras 12 horas sin asignar.\n\n" +
        "**Cálculo de comisiones:**\n- Conversión automática de monedas.\n- Detección de descuentos y propinas.\n- Tasas y comisiones según método de pago.\n\n" +
        "**IMPORTANTE**:\n- Ingresar precios falsos será verificado por <@1117934669002965014> y resultará en descuento de la venta.\n",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter),
  },

  // ========================================
  // PC PROGRAMAS
  // ========================================
  {
    id: ids.embeds.PC_PROGRAMAS,
    messageId: "1452814722239037572",
    embed: new EmbedBuilder()
      .setTitle("> Setup Informacion")
      .setDescription(
        "**Obligatorio:**\nLuego de mandar solicitud para unirse, enviar su numero por DM a un <@&" +
        roles.VENDOR +
        "> para que sean aceptados.\n\n",
      )
      .setColor(config.embedColor)
      .setThumbnail(config.embedThumbnail)
      .setFooter(config.embedFooter)
      .setTimestamp()
      .setImage("https://i.ibb.co/mrygpcyg/PROGRAMAS-REQUERIDOS-1.png"),
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Setup")
          .setStyle(ButtonStyle.Link)
          .setEmoji("🌐")
          .setURL("https://hyperv.online/tutorial/panel-full"),
        new ButtonBuilder()
          .setLabel("Grupo WhatsApp")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:wsp:1459018687817322618>")
          .setURL("https://chat.whatsapp.com/BqJU8Ph6F7s39JIbH9HpUL"),
      ),
    ],
  },

  // ========================================
  // PANEL IOS INFO
  // ========================================
  {
    id: ids.embeds.MOVIL_PROGRAMAS,
    messageId: "1435441785697730694",
    embed: new EmbedBuilder()
      .setTitle("> Setup Informacion")
      .setDescription(
        "**Obligatorio:**\nLuego de mandar solicitud para unirse, enviar su numero por DM a un <@&" +
        roles.VENDOR +
        "> para que sean aceptados.\n\n",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setTimestamp()
      .setImage("https://i.ibb.co/mrygpcyg/PROGRAMAS-REQUERIDOS-1.png"),
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Setup")
          .setStyle(ButtonStyle.Link)
          .setEmoji("🌐")
          .setURL("https://hyperv.online/tutorial/panel-ios"),
        new ButtonBuilder()
          .setLabel("Grupo WhatsApp")
          .setStyle(ButtonStyle.Link)
          .setEmoji("<:wsp:1459018687817322618>")
          .setURL("https://whatsapp.com/channel/0029Vb75gJvId7nSG7O3dM3p"),
      ),
    ],
  },

  // ========================================
  // BOOST
  // ========================================
  {
    id: ids.embeds.BOOST,
    messageId: "1118018791041937578",
    embed: new EmbedBuilder()
      .setTitle("> Boost Reward")
      .setDescription(
        "Boostea al servidor y obtendrás alguno de nuestros productos TOTALMENTE GRATIS.\n\n" +
        "**Obtendras:**\n- 2 Boost = Panel Boost x5 días.\n- 4 Boost = Panel Boost x15 días.\n- 6 Boost = Panel Boost x25 días.\n- 8 Boost = Panel Boost x40 días.",
      )
      .setColor(config.embedColor)
      .setThumbnail(config.embedThumbnail)
      .setFooter(config.embedFooter),
    components: [createTicketButton("ticket_boost")],
  },

  {
    id: ids.embeds.PAGOS_PERU, // metodos de pago de peru
    messageId: "1486894923176480981",
    embed: new EmbedBuilder()
      .setTitle("> Métodos de Pago Nacionales")
      .setDescription(
        "**BCP Soles** <:BCP:1117992075154178150>\n**Número de cuenta:** 47070818592082\n**CCI:** 00247017081859208231\n**Datos:** Carlos Bonifacio Guerra\n\n**Interbank Soles** <:INTERBANK:1117992077939200021>\n**Número de cuenta:** 8983317709473\n**CCI:** 00389801331770947346\n**Datos:** Carlos Bonifacio Guerra\n\n**Interbank Dólares** <:INTERBANK:1117992077939200021>\n**CCI:** 00389801330614896749\n**Datos:** Carlos Bonifacio Guerra\n\n**Scotiabank Soles** <:descarga:1117992071844872232>\n**Número de cuenta:** 1640618284\n**CCI:** 00930120164061828434\n**Datos:** Carlos Bonifacio Guerra\n\n**BBVA Soles** <:bbva:1117992076156612650>\n**Número de cuenta:** 0011-0241-0200790414\nCCI: 011-241-000200790414-73\n**Datos:** Carlos Bonifacio Guerra\n\n**Yape/Plin** <:yape:1117992073887502410>\n960 546 093\n**Datos:** Carlos Bonifacio Guerra",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter),
  },

  {
    id: ids.embeds.PAGOS_INTERNACIONALES,
    messageId: "1487854730905391186",
    embed: new EmbedBuilder()
      .setTitle("> Métodos de Pago Internacionales")
      .setDescription(
        "**Western Union** <:10892796357553685601:1117992080912945222>\n- **Nombres:** Carlos Mario Farid\n- **Apellidos:** Bonifacio Guerra\n- **DNI:** 76850426\n- **Celular:** +51 960 546 093\n- **País:** Perú\n- **Ciudad:** Pisco\n- **Dirección:** Calle los jazmines 341\n- **Nota:** Indicar que se recibe en dólares. Revise bien los datos, no se podrá devolver el dinero si hay errores.\n\n" +
        "**Remitly** <:1039637352546578432:1117992079289749566>\n**Indicar que se recibe en dólares**\n- **Banco:** INTERBANK\n- **Cuenta:** Ahorros dólares\n- **Número de cuenta:** 8983306148967\n- **Número de identificación:** 76850426\n- **Nombre completo:** Carlos Mario Farid\n- **Apellido:** Bonifacio\n- **Segundo apellido:** Guerra\n- **Teléfono:** 960 546 093\n- **País:** Perú\n- **Ciudad:** Pisco\n- **Región:** Ica\n\n" +
        "**Paypal** <:paypal:1117992083765080144>\n- **Correo:** diegohyperv011@gmail.com\n- **Mensaje obligatorio al pagar:**\nDeclaro que este dinero enviado desde (AQUI COLOCA TU NOMBRE) hacia DIEGO HUACA PEZET es totalmente legal, y declaro que el pago no es reembolsable bajo ninguna circunstancia. Soy el titular responsable de este envío de USD.\n- **Link de Donación:** https://www.paypal.com/donate/?hosted_button_id=V374LDC8RMTKC\n\n" +
        "**Binance** <:5393binancecoin:1117992082699718726>\n- **ID:** 488458041\n\n" +
        "~~**Cash App EEUU** <a:eeuu:1117992163658170448>\n- https://cash.app/$Jrz1lk\n\n~~" +
        "**Nequi Colombia** <:flagcolombia:1232045292887605290>\n- **Cuenta:** 3013969801\n- **Datos:** Jonatan Perez\n- **Tipo de cambio:** 5,000 pesos colombianos = 1 Dólar\n\n" +
        "**Banco Estado Chile:**\n- **Datos:** Martín Alonso Marín Contreras\n- **RUT:** 22777794-k\n- **Correo:** mkeria004@gmail.com\n- **Mercado Pago**\n- **Cuenta Vista**\n- **Número de cuenta: 1056187914\n\n" +
        "**MÉTODOS DE MÉXICO** <:flagmexico_1f1f21f1fd:1244856813053284437>\n\n" +
        "**Para transferencias:**\n- **Clabe NU (NUBANK): **638180010145897670\n- **Datos:** Karelys Ferrer\n- **Nota:** Si no encuentran Nu en el sistema, puedes decir que se deposita con PESPay.\n\n" +
        "**Para depositos:**\n- **Spin Oxxo: **5101 2505 6374 3542 \n- **Datos:** Karelys Ferrer\n- **Tipo de cambio (México): **1 Sol = 6,20 MXN\n\n" +
        "**CBU Argentina** <:flagargentina:1232045285241262251>\n- **Cuenta:** 0000177500090968404000\n- **Alias:** 47800448.ASTROPAY\n- **Nombre:** Diego Sirpa\n- **Tipo de cambio:** Google + 2000 Pesos Argentinos de comision\n\n" +
        "**Banrural monetaria - Guatemala <a:guatemala:1449442439277580369>**\n- **Cuenta:**3139173628\n- **Datos:** Kimberly Garcia\n\n" +
        "**Banco Pichincha** <:ecuador:1232045296998023260>\n- **Cuenta de ahorro transaccional:** 2214588834\n- **Datos:** Jostin Stiven Martinez Parrales\n" +
        "**Cuenta República Dominicana** <a:rddd:1449442346939973783>\n- **Nombre:**Jenny Joselin Rodríguez Castillo\n- **Numero de Cuenta:** 9607499842\n- **Cédula:** 0540131783-8\n\n" +
        "**Cuenta Prex Uruguay**\n- **Cuenta:** 22303077\n- **Nombre:**Luana Esbry\n\n" +
        "<a:spain:1117992165470122064> **Cuenta Bizum España**\n- **Cuenta:** 611557148\n- **Nombre:**Jeuri Hernández\n\n" +
        "**Página Web**\n- **Link:** [hyperv.online](https://hyperv.online)\n- **Pide el cupón de descuento para los clientes**",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter),
  },

  // ========================================
  // QR BOLIVIA
  // ========================================
  {
    id: ids.embeds.BANCO_BOLIVIA,
    messageId: "1464694776493244436",
    embed: new EmbedBuilder()
      .setTitle("> QR Bolivia")
      .setDescription(
        "**Transferencia QR**\n- **Banco**: BCP\n- **Titular**: Michael Montaño Callau\n- **Tipo de Cambio:** 1 sol = 3.6 bolivianos",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage(
        "https://i.ibb.co/bjTJqS5S/Whats-App-Image-2026-02-11-at-5-25-57-PM.jpg",
      ),
  },

  {
    id: ids.embeds.ZELLE,
    messageId: "1505640090737836055",
    embed: new EmbedBuilder()
      .setTitle("> Zelle")
      .setDescription(
        "**Transferencia Zelle**\n- **Titular**: JEFERSON RAMIREZ\n- **Numero**: +1 (720) 756-8895",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
  },

  {
    id: ids.embeds.COMISIONES_INFO,
    messageId: "1486896266112667699",
    embed: new EmbedBuilder()
      .setTitle("> HyperV | Comisiones")
      .setDescription(
        "<:zeusaa:1433927475976474624> **Panel Full**\nSoporte: S/10\nComisiones por ventas:\n- Semanal: S/10 | 2.65$\n- Mensual: S/20 | 5.30$\n- Trimestral: S/30 | 8$\n- Anual: S/40 | 10.50$\n\n" +
        "<:zeusaa:1433927475976474624> **Panel Basic**\nSoporte: S/5\nComisiones por ventas:\n- Semanal: S/8 | 2.10$\n- Mensual: S/15 | 4$\n- Trimestral: S/20 | 5.30$\n- Anual: S/30 | 8$\n\n" +
        "<:zeusaa:1433927475976474624> **Panel Only Aimbot**\nSoporte: S/5\nComisiones por ventas:\n- Semanal: S/5 | 2.10$\n- Mensual: S/10 | 4$\n- Trimestral: S/15 | 5.30$\n- Anual: S/25 | 8$\n\n" +
        "<:zeusaa:1433927475976474624> **Bypass APK**\nSoporte: S/5\nComisiones por ventas:\n- Semanal: S/10 | 3$\n- Mensual: S/20 | 5.9$\n\n" +
        "<:zeusaa:1433927475976474624> **Bypass UID**\nSoporte: S/5\nComisiones por ventas:\n- Semanal: S/10 | 3$\n- 14 días: S/15 | 4.5$\n- Mensual: S/20 | 5.9$\n- Trimestral: S/30 | 8.9$\n- Anual: S/40 | 11.8$\n\n" +
        "<:zeusaa:1433927475976474624> **Menu Chams ESP**\nSoporte: S/5\nComisiones por ventas:\n- Semanal: S/5 | 1.5$\n- Mensual: S/15 | 4.5$\n- Trimestral: S/20 | 5.9$\n- Anual: S/30 | 8.9$\n\n" +
        "<:zeusaa:1433927475976474624> **Panel iOS**\nSoporte: S/10\nComisiones por ventas:\n- 1 día: S/5 | 1.5$\n- 1 semana: S/10 | 3$\n- 1 mes: S/25 | 7.5$\n\n" +
        "<:zeusaa:1433927475976474624> **Aimbot Body iOS**\nSoporte: S/15\nComisiones:\n- Por temporada: S/20 | 6$\n\n" +
        "<:zeusaa:1433927475976474624> **Aimlock**\nSoporte: S/15\nComisiones:\n- Anual: S/25 | 7.5$\n\n" +
        "<:zeusaa:1433927475976474624> **Aimbot Proxy**\nSoporte: S/10\nComisiones:\n- Semanal: S/10 | 3$\nMensual: S/25 | 7.5$\n\n" +
        "<:zeusaa:1433927475976474624> **Panel Android**\nSoporte: S/10\nComisiones:\n- Semanal: S/10 | 3$\n- 14 dias: S/15 | 3.5$\n- Mensual: S/20 | 5.9$\n- 60 dias: S/30 | 8.9$\n\n" +
        "<:zeusaa:1433927475976474624> **Panel COD iOS**\nSoporte: S/10\nComisiones:\n- 1 dia: S/5 | 1.5$\n- Semanal: S/8 | 2.1$\n- Mensual: S/10 | 3$\n\n" +
        "<:zeusaa:1433927475976474624> **Regedit**\nSoporte: S/15\nComisiones:\n- Mensual: S/15 | 4$\n- Anual: S/30 | 8$\n\n" +
        "<:zeusaa:1433927475976474624> **Aimbot Color**\nSoporte: S/10\nComisiones:\n- Semanal: S/10 | 2.96$\n- Mensual: S/20 | 6$\n- Trimestral: S/30 | 9$\n\n" +
        "<:zeusaa:1433927475976474624> **Spoofer**\nSoporte: S/15\nComisiones:\n- Permanente: S/30 | 9$\n\n" +
        "<:zeusaa:1433927475976474624> **Boost rank**\n- No hay comisiones fijas",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter),
  },
];
