const fs = require("fs");
const path = require("path");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { buildProductContainer, buildPurchaseContainer, buildInfoContainer } = require("../utils/containerBuilder");
const {
  createTicketButton,
  createLanguageTicketButtons,
} = require("../utils/ticketButtons");
const config = require("./config");
const ids = require("./ids");
const { roles } = require("./ids");

const liston = "<:linea:1432870878382653530>".repeat(22) + "\n\n";

function createPurchaseContainer(ticketId, storeUrl) {
  return buildPurchaseContainer({
    description:
      "You can purchase directly on our website using Bitcoin, Paypal or Credit/Debit Card for **INSTANT DELIVERY**.\n" +
      "Puedes comprar directamente en nuestra página web usando Bitcoin, PayPal o Tarjeta de Crédito/Débito para recibir tu **PEDIDO AL INSTANTE**.\n\n" +
      "For other methods / Otros métodos: <#1466257895636209796>",
    buttons: [
      { label: "Comprar en Ticket / Buy on Ticket", style: ButtonStyle.Secondary, customId: ticketId, emoji: { name: "soporte", id: "1232042953908949034" } },
      { label: "Comprar en Web / Buy on Web", style: ButtonStyle.Link, url: storeUrl, emoji: { name: "compra", id: "1316171968717918379" } },
    ],
  });
}

module.exports = [
  {
    id: ids.embeds.WEBSITE,
    messageId: "1538692438204481547",
    container: buildInfoContainer({
      title: "## Website",
      description:
        "Explora nuestra tienda oficial y descubre todos nuestros productos disponibles.\n\n" +
        "**Juegos destacados**\n\n" +
        "<:ff:1433261279979769856> Free Fire\n" +
        "<:valoo:1466276625480941774> Valorant\n" +
        "<:csgoo:1466276596787708016> CSGO\n" +
        "<:warzone:1466276557348929566> Call of Duty\n\n" +
        "<:garantia:1321973733971333150> Disfruta de una entrega inmediata y un Soporte 24/7 para asistirte en todo momento.\n" +
        "<:garantia:1321973733971333150> Contamos con Métodos de pago internacionales y nacionales para que puedas adquirir tus che4ts favoritos sin problemas.",
      image: config.defaultImage,
      buttons: [
        { label: "Ir a la Tienda", style: ButtonStyle.Link, url: "https://hyperv.online", emoji: { name: "website", id: "1459019351410872362" } }
      ]
    }),
  },

  {
    id: ids.embeds.PAYMENT,
    messageId: "1538692440444371065",
    container: buildInfoContainer({
      title: "## Métodos de Pago",
      description:
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
        "<:flagunitedstates:1232045303574827080> Zelle/CashApp",
      image: config.defaultImage,
      buttons: [
        { label: "Check our products", style: ButtonStyle.Link, url: "https://discord.com/channels/1117932314102595716/1117935960852803696", emoji: { name: "compra", id: "1316466484133757021" } }
      ]
    }),
  },

  {
    id: ids.embeds.SOCIAL_NETWORKS,
    messageId: "1538692441845014599",
    container: buildInfoContainer({
      title: "## Redes Sociales",
      description: "Síguenos en nuestras redes sociales, donde podrás estar al tanto de nuestras últimas novedades, promociones y contenido exclusivo.",
      image: config.defaultImage,
      buttons: [
        { label: "Website", style: ButtonStyle.Link, url: "https://hyperv.online", emoji: "🌐" },
        { label: "Instagram", style: ButtonStyle.Link, url: "https://www.instagram.com/hypervgg.pe/", emoji: { name: "instagram36", id: "1317355853182926939" } },
        { label: "TikTok", style: ButtonStyle.Link, url: "https://www.tiktok.com/@hypervgg", emoji: { name: "987340874914619432", id: "1118071042510954548", animated: true } },
        { label: "YouTube", style: ButtonStyle.Link, url: "https://www.youtube.com/@hyperggg", emoji: { name: "Youtube", id: "1316608060675985468" } }
      ]
    }),
  },

  {
    id: ids.embeds.TICKET_GENERAL,
    messageId: "1538692443216679075",
    container: buildInfoContainer({
      title: "## Ticket",
      description:
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
      image: config.defaultImage,
      actionRows: [createLanguageTicketButtons()],
    }),
  },

  // ========================================
  // PANEL FULL
  // ========================================
  {
    id: ids.embeds.PANEL_FULL,
    messageId: "1538692446282584096",
    container: buildProductContainer({
      title: "## Panel Full",
      functions:
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
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "Semanal: $ 25.00 | S/. 60.00",
        "Mensual: $ 40.00 | S/. 110.00",
        "Trimestral: $ 50.00 | S/. 150.00",
        "Anual: $ 65.00 | S/. 200.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/panel-full.png",
    }),
    extraContainer: createPurchaseContainer("ticket_panel_full", "https://hyperv.online/products/panel-full"),
    extraMessageId: null,
  },

  // ========================================
  // PANEL SECURE
  // ========================================
  {
    id: ids.embeds.PANEL_SECURE,
    messageId: "1538692447469703180",
    container: buildProductContainer({
      title: "## Panel Secure",
      functions:
        "- **Aimbot Memory**\n> Neck/Legit\n" +
        "- **Visuals - Chams**\n> 3D/Glow/Solido/Wireframe/Oreon/Wukong-Naruto/RGB\n" +
        "- **Fake Lag**\n> Flush/Ghost/Freeze/FreezeTimer\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "Semanal: $ 11.00 | S/. 40.00",
        "Mensual: $ 22.00 | S/. 80.00",
        "Trimestral: $ 32.00 | S/. 120.00",
        "Anual: $ 40.00 | S/. 150.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/panel-secure.png",
    }),
    extraContainer: createPurchaseContainer("ticket_panel_secure", "https://hyperv.online/products/panel-secure"),
    extraMessageId: null,
  },

  // ========================================
  // PANEL ONLY AIMBOT
  // ========================================
  {
    id: ids.embeds.PANEL_ONLY_AIMBOT,
    messageId: "1538692448576872473",
    container: buildProductContainer({
      title: "## Panel Only Aimbot",
      functions:
        "- **Aimbot Memory**\n> Neck/Legit\n" +
        "- **Fake Lag**\n> Flush/Ghost/Freeze/FreezeTimer\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "Semanal: $ 6.00 | S/. 20.00",
        "Mensual: $ 15.00 | S/. 55.00",
        "Trimestral: $ 25.00 | S/. 90.00",
        "Anual: $ 30.00 | S/. 130.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/panel-only-aimbot.png",
    }),
    extraContainer: createPurchaseContainer("ticket_panel_only_aimbot", "https://hyperv.online/products/panel-only-aimbot"),
    extraMessageId: null,
  },

  // ========================================
  // MENU BASIC
  // ========================================
  {
    id: ids.embeds.MENU_BASIC,
    messageId: "1538692448576872473",
    container: buildProductContainer({
      title: "## Menu Basic",
      functions:
        "- **Aimbot Memory**\n> Neck/Legit\n" +
        "- **Visuals - Chams**\n> 3D/Glow/Solido/RGB\n" +
        "- **Fake Lag**\n> Flush/Ghost/Freeze/FreezeTimer/Lines\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "Semanal: $ 15.00 | S/. 50.00",
        "Mensual: $ 30.00 | S/. 100.00",
        "Trimestral: $ 40.00 | S/. 130.00",
        "Anual: $ 50.00 | S/. 170.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/menu-basic.jpeg",
    }),
    extraContainer: createPurchaseContainer("ticket_menu_basic", "https://hyperv.online/products/menu-basic"),
    extraMessageId: null,
  },

  // ========================================
  // CHAMS PC
  // ========================================
  {
    id: ids.embeds.MENU_CHAMS,
    messageId: "1538692450439270422",
    container: buildProductContainer({
      title: "## Menu Chams",
      functions:
        "- **Visuals - Chams**\n> 3D/Glow/Solido/Wireframe/Oreon/Wukong-Wukong Naruto/RGB\n" +
        "- **ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "Semanal: $ 5.00 | S/. 25.00",
        "Mensual: $ 15.00 | S/. 50.00",
        "Trimestral: $ 20.00 | S/. 70.00",
        "Anual: $ 25.00 | S/. 90.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/menu-chams.png",
    }),
    extraContainer: createPurchaseContainer("ticket_chams", "https://hyperv.online/products/menu-chams"),
    extraMessageId: null,
  },

  // ========================================
  // BYPASS ID
  // ========================================
  {
    id: ids.embeds.BYPASS_ID,
    messageId: "1538692452054212662",
    container: buildProductContainer({
      title: "## Bypass UID",
      functions:
        "- **Bypass Emulador**\n> 64 Bits\n" +
        "- **Bluestacks and MSI compatibility**\n- **Good FPS**\n- **Proxy and ID Injection**\n- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "1 dia: $ 3.00 | S/. 10.00",
        "Semanal: $ 9.00 | S/. 30.00",
        "Mensual: $ 30.00 | S/. 90.00",
        "Trimestral: $ 40.00 | S/. 140.00",
        "Anual: $ 60.00 | S/. 190.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/bypass-uid.png",
    }),
    extraContainer: createPurchaseContainer("ticket_bypass_id", "https://hyperv.online/products/bypass-uid"),
    extraMessageId: null,
  },

  // ========================================
  // BYPASS GLOBAL
  // ========================================
  {
    id: ids.embeds.BYPASS_GLOBAL,
    messageId: "1538625794262442047",
    container: buildProductContainer({
      title: "## Bypass Global",
      functions:
        "- **Bypass Emulador**\n> 64 Bits\n" +
        "- **Bluestacks and MSI compatibility**\n- **Good FPS**\n- **Proxy and ID Injection**\n- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "1 Dia: $ 3.00 | S/. 10.00",
        "Semanal: $ 9.00 | S/. 30.00",
        "14 Dias: $ 14.00 | S/. 50.00",
        "Mensual: $ 40.00 | S/. 100.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/bypass-global.png",
    }),
    extraContainer: createPurchaseContainer("ticket_bypass_global", "https://hyperv.online/products/bypass-global"),
    extraMessageId: null,
  },

  // ========================================
  // BYPASS APK
  // ========================================
  {
    id: ids.embeds.BYPASS_APK,
    messageId: "1538692454566338625",
    container: buildProductContainer({
      title: "## Bypass APK",
      functions:
        "- **Bypass Emulador**\n> 64Bits\n" +
        "- **Bluestacks and MSI compatibility**\n- **Good FPS**\n- **APK Injection**\n- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "Semanal: $ 15.00 | S/. 60.00",
        "Mensual: $ 35.00 | S/. 130.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/bypass-apk.png",
    }),
    extraContainer: createPurchaseContainer("ticket_bypass_apk", "https://hyperv.online/products/bypass-apk"),
    extraMessageId: null,
  },

  // ========================================
  // PANEL IOS
  // ========================================
  {
    id: ids.embeds.PANEL_IOS,
    messageId: "1538692456223080600",
    container: buildProductContainer({
      title: "## Panel iOS",
      functions:
        "- **Aimbot**\n> Head/Neck/Assist/Cycle/Silent/AimKill\n" +
        "- **ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n" +
        "- **Misc**\n> NoRecoil/BackJump/InvertedWall/\n" +
        "- **Stream Mode**\n- **No need JailBreak**\n- **No need computer to install**\n- **Includes Gbox certificate**\n- **Compatible with all iOS Versions**",
      prices: [
        "1 dia: $ 10.00 | S/. 35.00",
        "Semanal: $ 25.00 | S/. 85.00",
        "Mensual: $ 45.00 | S/. 160.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/panel-ios.png",
    }),
    extraContainer: createPurchaseContainer("ticket_panel_ios", "https://hyperv.online/products/panel-ios"),
    extraMessageId: null,
  },

  // ========================================
  // AIMBOT BODY IOS
  // ========================================
  {
    id: ids.embeds.AIMBOT_BODY_IOS,
    messageId: "1538692457842216962",
    container: buildProductContainer({
      title: "## Aimbot Body",
      functions:
        "Presentamos nuestro nuevo Aimbot Body mediante Jailbreak, obtendrás una victoria asegurada sin bug de daño en tu dispositivo iOS.\n\n" +
        "- Soporte Sistema: iOS\n- Soporte Versión del sistema: Todas\n- Soporte Idiomas: Inglés/Español/Portugués",
      prices: ["Por Temporada: $ 50.00 | S/. 180.00"],
      image: "https://i.ibb.co/fY5MmBNq/AIMBOT-IOS-BODY-1.png",
    }),
    extraContainer: createPurchaseContainer("ticket_aimbot_body_ios", "https://hyperv.online/products/aimbot-body-ios"),
    extraMessageId: null,
  },

  // ========================================
  // PANEL ANDROID
  // ========================================
  {
    id: ids.embeds.PANEL_ANDROID,
    messageId: "1538692459217944698",
    container: buildProductContainer({
      title: "## Panel Android",
      functions:
        "- **Trick**\n> Aimtrick/AimLegit/ShowFov/TypeOfRegedit\n" +
        "- **Helper**\n> CalibrateSensitivity/HeadTrick/Aimlock/Holograma\n" +
        "- **Misc**\n> Background/Liners/TextViews/Linear/ImageView/Button\n" +
        "- **Settings**\n> SaveConfig/ResetConfig/HideIcon/ShowIcon/DeleteCheats/Bypass\n" +
        "- **Optim**\n> DisableGApps/DisableAll/DisableOther/FixInputLag\n" +
        "- **Compatible with all Android Versions**",
      prices: [
        "Semanal: $ 10.00 | S/. 35.00",
        "14 dias: $ 17.00 | S/. 60.00",
        "Mensual: $ 30.00 | S/. 100.00",
        "60 dias: $ 45.00 | S/. 150.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/panel-android.png",
    }),
    extraContainer: createPurchaseContainer("ticket_panel_android", "https://hyperv.online/products/panel-android"),
    extraMessageId: null,
  },

  // ========================================
  // AIMBOT BODY ANDROID
  // ========================================
  {
    id: ids.embeds.AIMBOT_BODY_ANDROID,
    messageId: "1538692460677562430",
    container: buildProductContainer({
      title: "## Aimbot Body Android",
      functions: "- **Aimbot**\n> Body\n\n**Compatible con dispositivos Xiaomi**",
      prices: ["Por Temporada: $ 40.00 | S/. 140.00"],
      image: "https://www.realcloudx.com/Cloud/tanatozn/aimbot-body-android.png",
    }),
    extraContainer: createPurchaseContainer("ticket_aimbot_body_android", "https://hyperv.online/products/aimbot-body-android"),
    extraMessageId: null,
  },

  // ========================================
  // AIMBOT PROXY
  // ========================================
  {
    id: ids.embeds.AIMBOT_PROXY,
    messageId: "1538692462636310680",
    container: buildProductContainer({
      title: "## Aimbot Proxy",
      functions: "- **120 FPS**\n- **Bypass relogin**\n- **Aimdrag**\n- **Aimbot Pecho**\n- **Hologramas Avatar**\n- **Hologramas Armas**",
      prices: [
        "Semanal: $ 25.00 | S/. 85.00",
        "Mensual: $ 55.00 | S/. 190.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/aimbot-proxy.png",
    }),
    extraContainer: createPurchaseContainer("ticket_aimbot_proxy", "https://hyperv.online/products/aimbot-proxy"),
    extraMessageId: null,
  },

  // ========================================
  // AIMLOCK
  // ========================================
  {
    id: ids.embeds.AIMLOCK,
    messageId: "1538692465161408554",
    container: buildProductContainer({
      title: "## Aimlock",
      functions:
        "- **Assist**\n> Aimlock/AimTrick\n- **Misc**\n> NoFakeDamage\n" +
        "- **No need JailBreak**\n- **No need Phone reset**\n- **No need computer to install**\n- **Compatible with all iOS Versions**",
      prices: ["Anual: $ 50.00 | S/. 180.00"],
      image: "https://www.realcloudx.com/Cloud/tanatozn/aimlock.png",
    }),
    extraContainer: createPurchaseContainer("ticket_aimlock", "https://hyperv.online/products/aimlock"),
    extraMessageId: null,
  },

  // ========================================
  // REGEDIT
  // ========================================
  {
    id: ids.embeds.REGEDIT,
    messageId: "1538692467560284274",
    container: buildProductContainer({
      title: "## Regedit",
      functions:
        "Nuestro regedit te ofrece corregir la mira perfectamente.\n\n" +
        "- Soporte Sistema: Android\n- Soporte Versión del sistema: Todas\n- Soporte Idiomas: Inglés/Español/Portugués",
      prices: [
        "Mensual: $ 25.00 | S/. 80.00",
        "Anual: $ 35.00 | S/. 130.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/regedit.png",
    }),
    extraContainer: createPurchaseContainer("ticket_regedit", "https://hyperv.online/products/regedit"),
    extraMessageId: null,
  },

  // ========================================
  // AIMBOT COLOR - VALORANT
  // ========================================
  {
    id: ids.embeds.AIMBOT_COLOR,
    messageId: "1538692468625776772",
    container: buildProductContainer({
      title: "## Aimbot Color",
      functions:
        "- **Aimbot**\n> Hold/Toogle mode\n- **Trigger Bot**\n- **Recoil Control**\n- **Insta Locker**\n- **Match Info**\n> Reveal players name and rank\n- **Mobile Control**\n- **All mices compatible**\n- **Windows 10 & 11**\n- **HVCI ON & OFF**",
      prices: [
        "Semanal: $ 15.00 | S/. 60.00",
        "Mensual: $ 35.00 | S/. 110.00",
        "Trimestral: $ 65.00 | S/. 220.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/aimbot-color.png",
    }),
    extraContainer: createPurchaseContainer("ticket_aimbot_color", "https://hyperv.online/products/aimbot-color"),
    extraMessageId: null,
  },

  // ========================================
  // SPOOFER
  // ========================================
  {
    id: ids.embeds.SPOOFER,
    messageId: "1538692469804245064",
    container: buildProductContainer({
      title: "## Spoofer",
      functions:
        "Nuestro Spoofer te ayudará a falsificar las características del HWID.\n\n" +
        "**SOPORTE:**\n- Fortnite\n- Rust\n- Apex\n- Dayz\n- Valorant",
      prices: ["Permanente: $ 50.00 | S/. 180.00"],
      image: "https://www.realcloudx.com/Cloud/tanatozn/spoofer.png",
    }),
    extraContainer: createPurchaseContainer("ticket_spoofer", "https://hyperv.online/products/spoofer"),
    extraMessageId: null,
  },

  // ========================================
  // BOOST RANK
  // ========================================
  {
    id: ids.embeds.BOOST_RANK,
    messageId: "1538692471591014534",
    container: buildProductContainer({
      title: "## Boost Rank",
      functions:
        "**¿Estás listo para dejar atrás tus límites actuales?**\n" +
        "Ofrecemos servicios de boosteo personalizados en Valorant.\n\n" +
        "**¿Qué Ofrecemos?**\n" +
        "**Boosteo Personalizado:** Escoge el rango al que deseas llegar.\n" +
        "**Total Seguridad:** Tu cuenta estará protegida.",
      prices: null,
      image: "https://www.realcloudx.com/Cloud/tanatozn/boost-rank.png",
    }),
    extraContainer: createPurchaseContainer("ticket_boost_rank", "https://hyperv.online/products/boost-rank"),
    extraMessageId: null,
  },

  // ========================================
  // PANEL CSGO
  // ========================================
  {
    id: ids.embeds.PANEL_CSGO,
    messageId: "1538692473243705346",
    container: buildProductContainer({
      title: "## Panel CSGO",
      functions:
        "**Descubre nuestro nuevo panel de CSGO2**.\n\n" +
        "- Soporte Windows: 8/10/11\n- Soporte CPU: Intel/AMD/Xeon\n- Soporte Idiomas: Inglés/Español/Portugués",
      prices: [
        "Semanal: $ 20.00 | S/. 70.00",
        "Mensual: $ 45.00 | S/. 160.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/panel-csgo.png",
    }),
    extraContainer: createPurchaseContainer("ticket_panel_csgo", "https://hyperv.online/products/panel-csgo"),
    extraMessageId: null,
  },

  // ========================================
  // PANEL COD IOS
  // ========================================
  {
    id: ids.embeds.PANEL_COD_IOS,
    messageId: "1538692474824818751",
    container: buildProductContainer({
      title: "## Panel COD iOS",
      functions:
        "- **Aimbot**\n> Head/Neck/Assist/Cycle/Silent/AimKill\n" +
        "- **ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n" +
        "- **Misc**\n> NoRecoil/BackJump/InvertedWall/",
      prices: [
        "x1 dia: $ 15.00 | S/. 50.00",
        "Semanal: $ 30.00 | S/. 100.00",
        "Mensual: $ 50.00 | S/. 170.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/panel-cod-ios.png",
    }),
    extraContainer: createPurchaseContainer("ticket_panel_cod_ios", "https://hyperv.online/products/panel-cod-ios"),
    extraMessageId: null,
  },

  // ========================================
  // PANEL WARZONE
  // ========================================
  {
    id: ids.embeds.PANEL_WARZONE,
    messageId: "1538692476347351112",
    container: buildProductContainer({
      title: "## Panel Warzone",
      functions:
        "Panel Warzone — compatible con Xbox, Steam y BattleNet.\n\n" +
        "- Compatibilidad: Xbox, Steam, BattleNet\n- Soporte Windows: 8/10/11\n- Soporte CPU: Intel/AMD/Xeon\n- Soporte Idiomas: Inglés/Español/Portugués",
      prices: [
        "15 dias: $ 30.00 | S/. 110.00",
        "Mensual: $ 65.00 | S/. 200.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/panel-warzone.png",
    }),
    extraContainer: createPurchaseContainer("ticket_panel_warzone", "https://hyperv.online/products/panel-warzone"),
    extraMessageId: null,
  },

  // ========================================
  // CHAMS BLOODSTRIKE
  // ========================================
  {
    id: ids.embeds.CHAMS_BLOODSTRIKE,
    messageId: "1538692478075670560",
    container: buildProductContainer({
      title: "## Menu Chams Bloodstrike",
      functions:
        "- **Visuals - Chams**\n> 3D/Glow/Solido/Wireframe/Oreon/Wukong Naruto/RGB\n" +
        "- **ESP**\n> Line/Box/Name/RangoBR/Skeleton/Health/WeaponIcon/WeaponText\n" +
        "- **Stream Spoof**\n- **All mices compatible**\n- **Windows 8/10/11**\n- **HVCI ON & OFF**",
      prices: [
        "Semanal: $ 12.00 | S/. 40.00",
        "Mensual: $ 30.00 | S/. 100.00",
        "Trimestral: $ 40.00 | S/. 140.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/chams-blood.png",
    }),
    extraContainer: createPurchaseContainer("ticket_chams_bloodstrike", "https://hyperv.online/products/menu-chams-bloodstrike"),
    extraMessageId: null,
  },

  // ========================================
  // NITRO & BOOSTER
  // ========================================
  {
    id: ids.embeds.NITRO,
    messageId: "1538692478960406602",
    container: buildProductContainer({
      title: "## Discord Nitro & Booster",
      functions: "¿Quieres disfrutar de Discord Nitro o mejorar tu servidor con boosts?",
      prices: [
        "6 boosts x1 mes: $ 7.00 | S/. 25.00",
        "6 boosts x3 meses: $ 12.00 | S/. 45.00",
        "14 boosts x1 mes: $ 12.00 | S/. 45.00",
        "14 boosts x3 meses: $ 20.00 | S/. 70.00",
        "30 boosts x1 meses: $ 20.00 | S/. 75.00",
        "30 boosts x3 mes: $ 40.00 | S/. 140.00",
        "1000 users online: $ 12.00 | S/. 40.00",
        "1000 users offline: $ 25.00 | S/. 80.00",
      ],
      image: "https://www.realcloudx.com/Cloud/tanatozn/discord-tools.png",
    }),
    extraContainer: createPurchaseContainer("ticket_nitro_booster", "https://hyperv.online/products/discord-tools"),
    extraMessageId: null,
  },

  // ========================================
  // INFO COMANDOS
  // ========================================
  {
    id: ids.embeds.INFO_COMANDOS,
    messageId: "1538692480357105677",
    embed: new EmbedBuilder()
      .setTitle("> Comandos")
      .setDescription(
        "Lista completa de comandos disponibles para el equipo de ventas y soporte.\n\n" +
        "**Gestión de ventas:**\n" +
        "- `/venta` - Registrar ventas de cualquier producto.\n" +
        "- `/upgrade` - Cambiar o mejorar productos pagando la diferencia.\n" +
        "- `/gracias` - Informar al cliente que su compra fue efectiva.\n" +
        "- `/pago` - Crea un link para realizar la compra mediante Mercado Pago.\n" +
        "- `/propina` - Registrar propinas de cualquier metodo de pago.\n" +
        "- `/eliminar-venta` - Eliminar ventas mal ingresadas.\n" +
        "- `/resumen-vendedor` - Ver resumen de ventas de un vendedor en el período actual.\n\n" +
        "**Clientes:**\n" +
        "- `/buscar-cliente` - Ver historial de compras de un cliente por WhatsApp o Discord.\n\n" +
        "**Información de productos:**\n" +
        "- `/precio` - Listar precios y características de productos.\n" +
        "- `/link` - Mostrar enlace directo de un producto de la tienda.\n" +
        "- `/instalacion` - Pasos y requisitos para instalación de productos PC.\n\n" +
        "**Carrito de compras:**\n" +
        "- `/carrito` - Agregar productos al carrito web del cliente.\n\n" +
        "**Métodos de pago:**\n" +
        "- `/metodos` - Listar métodos de pago por país.\n" +
        "- `/datos` - Mostrar datos de métodos de pago específicos.\n\n" +
        "**Administración:**\n" +
        "- `/reporte-mensual` - Generar Excel de comisiones mensuales.\n" +
        "- `/embed` - Genera un embed fácil y rápido.\n" +
        "- `/info` - Muestra información del bot.\n" +
        "- `/limpiar` - Elimina todos los embeds de los canales.\n",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter),
  },


  {
    id: ids.embeds.BOT,
    messageId: "1538692481699414137",
    embed: new EmbedBuilder()
      .setTitle("> Sistema de Comisiones")
      .setDescription(
        "**Sistema automatizado de gestión de ventas y comisiones**\n\n" +
        "**Registro de ventas:**\n" +
        "- Comando `/venta` con autocompletado de productos y períodos.\n" +
        "- Registro automático en base de datos.\n" +
        "- Asignación inmediata al vendedor.\n\n" +
        "**Notificaciones automáticas:**\n" +
        "- Recordatorios de soporte: 10 minutos inicial, luego cada hora.\n" +
        "- Bloqueo automático tras 12 horas sin soporte asignado.\n" +
        "- Recordatorio automático 3 días antes de que venza una licencia.\n\n" +
        "**Cálculo de comisiones:**\n" +
        "- Conversión automática de monedas.\n" +
        "- Detección de descuentos y propinas.\n" +
        "- Alerta automática si el descuento supera el 10%.\n" +
        "- Tasas y comisiones según método de pago.\n\n" +
        "**IMPORTANTE:**\n" +
        "- Ingresar precios falsos será verificado por <@1117934669002965014> y resultará en descuento de la venta.\n",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter),
  },

  // ========================================
  // BUSCAR CLIENTE INFO
  // ========================================
  {
    id: ids.embeds.BUSCAR_CLIENTE_INFO, // agregar este ID en ids.js
    messageId: "TU_MESSAGE_ID_AQUI",
    embed: new EmbedBuilder()
      .setTitle("> Recuperación de Clientes")
      .setDescription(
        "**¿Para qué sirve `/buscar-cliente`?**\n\n" +
        "Permite ver el historial completo de compras de un cliente: qué productos tiene, cuándo vencen y quién los atendió.\n\n" +
        "Esto nos permite **contactar al cliente antes de que su licencia venza** y ofrecerle renovación, lo que aumenta las ventas recurrentes.\n\n" +
        "**⚠️ Por esto es OBLIGATORIO registrar el número de WhatsApp al hacer una venta.**\n\n" +
        "Sin el WhatsApp no podemos:\n" +
        "- Buscar al cliente en el historial\n" +
        "- Contactarlo para renovaciones\n" +
        "- Recuperar ventas perdidas\n\n" +
        "**Cómo usarlo:**\n" +
        "- `/buscar-cliente 987654321` — buscar por número de WhatsApp\n" +
        "- `/buscar-cliente @usuario` — buscar por usuario de Discord\n\n" +
        "El sistema muestra las últimas 10 compras con fecha de vencimiento y estado actual.",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter),
  },

  // ========================================
  // PC PROGRAMAS
  // ========================================
  {
    id: ids.embeds.PC_PROGRAMAS,
    messageId: "1538692482802655235",
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
    messageId: "1538692484446552186",
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
    messageId: "1538692485700911125",
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
    id: ids.embeds.PAGOS_PERU,
    messageId: "1538692486665478287",
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
    messageId: "1538692487944732765",
    embed: new EmbedBuilder()
      .setTitle("> Métodos de Pago Internacionales")
      .setDescription(
        "**Western Union** <:10892796357553685601:1117992080912945222>\n- **Nombres:** Carlos Mario Farid\n- **Apellidos:** Bonifacio Guerra\n- **DNI:** 76850426\n- **Celular:** +51 960 546 093\n- **País:** Perú\n- **Ciudad:** Pisco\n- **Dirección:** Calle los jazmines 341\n- **Nota:** Indicar que se recibe en dólares. Revise bien los datos, no se podrá devolver el dinero si hay errores.\n\n" +
        "**Remitly** <:1039637352546578432:1117992079289749566>\n**Indicar que se recibe en dólares**\n- **Banco:** INTERBANK\n- **Cuenta:** Ahorros dólares\n- **Número de cuenta:** 8983306148967\n- **Número de identificación:** 76850426\n- **Nombre completo:** Carlos Mario Farid\n- **Apellido:** Bonifacio\n- **Segundo apellido:** Guerra\n- **Teléfono:** 960 546 093\n- **País:** Perú\n- **Ciudad:** Pisco\n- **Región:** Ica\n\n" +
        "**Paypal** <:paypal:1117992083765080144>\n- **Correo:** diegohyperv011@gmail.com\n- **Mensaje obligatorio al pagar:**\nDeclaro que este dinero enviado desde (AQUI COLOCA TU NOMBRE) hacia DIEGO HUACA PEZET es totalmente legal, y declaro que el pago no es reembolsable bajo ninguna circunstancia. Soy el titular responsable de este envío de USD.\n- **Link de Donación:** https://www.paypal.com/donate/?hosted_button_id=V374LDC8RMTKC\n\n" +
        "**Binance** <:5393binancecoin:1117992082699718726>\n- **ID:** 488458041\n\n" +
        "**Cash App EEUU** <a:eeuu:1117992163658170448>\n- https://cash.app/$angxeee1\n\n" +
        "**Nequi Colombia** <:flagcolombia:1232045292887605290>\n- **Cuenta:** 3013969801\n- **Datos:** Jonatan Perez\n- **Tipo de cambio:** 5,000 pesos colombianos = 1 Dólar\n\n" +
        "**Banco Estado Chile (Cuenta RUT):**\n- **RUT:** 212725927\n- **Nombre:** Germán fuentes\n- **Cuenta RUT**\n\n" +
        "**MÉTODOS DE MÉXICO** <:flagmexico_1f1f21f1fd:1244856813053284437>\n\n" +
        "**Para transferencias:**\n- **Clabe NU (NUBANK): **638180010145897670\n- **Datos:** Karelys Ferrer\n- **Nota:** Si no encuentran Nu en el sistema, puedes decir que se deposita con PESPay.\n\n" +
        "**Para depositos:**\n- **Spin Oxxo: **5101 2505 6374 3542 \n- **Datos:** Karelys Ferrer\n- **Tipo de cambio (México): **1 Sol = 6,20 MXN\n\n" +
        "**CBU Argentina** <:flagargentina:1232045285241262251>\n- **Cuenta:** 0000177500090968404000\n- **Alias:** diegozn47\n- **Nombre:** Diego Sirpa\n- **Tipo de cambio:** Google + 2000 Pesos Argentinos de comision\n\n" +
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
    messageId: "1538692489010221097",
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
    messageId: "1538692490654253118",
    embed: new EmbedBuilder()
      .setTitle("> Zelle")
      .setDescription(
        "**Transferencia Zelle**\n- **Titular**: Angel Salas\n- **Numero**: +1 (908) 477-3454",
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
  },

  {
    id: ids.embeds.COMISIONES_INFO,
    messageId: "1538692492059484181",
    embed: new EmbedBuilder()
      .setTitle("> HyperV | Comisiones")
      .setDescription(
        "<:zeusaa:1433927475976474624> **Panel Full**\nSoporte: S/10\nComisiones por ventas:\n- Semanal: S/10 | 2.65$\n- Mensual: S/20 | 5.30$\n- Trimestral: S/30 | 8$\n- Anual: S/40 | 10.50$\n\n" +
        "<:zeusaa:1433927475976474624> **Panel Basic**\nSoporte: S/5\nComisiones por ventas:\n- Semanal: S/8 | 2.10$\n- Mensual: S/15 | 4$\n- Trimestral: S/20 | 5.30$\n- Anual: S/30 | 8$\n\n" +
        "<:zeusaa:1433927475976474624> **Panel Only Aimbot**\nSoporte: S/5\nComisiones por ventas:\n- Semanal: S/5 | 2.10$\n- Mensual: S/10 | 4$\n- Trimestral: S/15 | 5.30$\n- Anual: S/25 | 8$\n\n" +
        "<:zeusaa:1433927475976474624> **Menu Basic**\nSoporte: S/10\nComisiones por ventas:\n- Semanal: S/9 | 2.60$\n- Mensual: S/18 | 5.40$\n- Trimestral: S/25 | 7.40$\n- Anual: S/35 | 10$\n\n" +
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
