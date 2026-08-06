const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { roles, channels } = require('../data/ids');
const config = require('../data/config');

const messageEmbed = new EmbedBuilder()
  .setTitle('> Juega sin limites con HyperV! <a:flashrayo:1450570834212032746>')
  .setDescription(
    "Sigue estos pasos para generar un ticket:\n\n" +
    "<a:1_:1157447561339215963> Elige un producto de HyperV.\n" +
    "<a:2_:1157447558713581678> Selecciona un plan en el menú de precios.\n" +
    "<a:3_:1157447554645102643> Ingresa al ticket creado.\n\n" +
    "**Ventajas:**\n" +
    "- <:compra:1316171968717918379> Compra rápida y segura.\n" +
    "- <:garantia:1321973733971333150> Garantía de productos.\n" +
    "- <:support1:1321973732193075362> Soporte 24/7 disponible.\n\n" +
    `<:zeusaa:1433927475976474624> *Realiza tu compra solo con un <@&${roles.VENDOR}>*`)
  .setColor(config.embedColor)
  .setImage(config.defaultImage)
  .setFooter(config.embedFooter);

const products = [
  {
    name: 'Panel Secure + Bypass APK',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <:fire:1450570834212032746> **BYPASS APK + ESP + AIMBOTS**

      ¿Quieres jugar con tus amigos de móvil y a la vez pegar todo rojo? Tenemos la mejor promocion para ti.

      <a:flashrayo:1450570834212032746> Adquiere nuestro pack de productos para que tus rankeds sean seguras, faciles y rapidas.
      - Atención inmediata
      - Garantia de productos
      - Sin esperas, pagas y obtienes el producto

      <a:flashrayo:1450570834212032746> **Licencias:** Desde semanal hasta por un año.
      <a:flashrayo:1450570834212032746> **Entrega 100% inmediata. Sin esperar**

      **METODOS DE PAGO:**
      **Métodos de pago disponibles a cualquier parte del mundo**`
  },
  {
    name: 'Panel Secure + Bypass ID',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <:fire:1450570834212032746> **BYPASS ID + ESP + AIMBOTS**

      ¿Quieres jugar sin riesgo de baneo y con máxima seguridad? Este es el pack perfecto para ti.

      <a:flashrayo:1450570834212032746> Adquiere nuestro pack de productos para que tus rankeds sean seguras, faciles y rapidas.
      - Atención inmediata
      - Garantia de productos
      - Sin esperas, pagas y obtienes el producto

      <a:flashrayo:1450570834212032746> **Licencias:** Desde semanal hasta por un año.
      <a:flashrayo:1450570834212032746> **Entrega 100% inmediata. Sin esperar**

      **METODOS DE PAGO:**
      **Métodos de pago disponibles a cualquier parte del mundo**`
  },
  {
    name: 'Panel Full',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <a:1_:1157447561339215963> Acceso completo al panel con todas las funciones.
      <a:2_:1157447558713581678> Aimbots full, ESP/Chams, Wallhack.
      <a:3_:1157447554645102643> Un <@&${roles.VENDOR}> te ayudará a configurarlo.

      __**VENTAJAS:**__
      - <:compra:1316171968717918379> Estabilidad y rendimiento máximos.\n- <:garantia:1321973733971333150> Actualizaciones constantes.\n- <:support1:1321973732193075362> Soporte 24/7 disponible.`
  },
  {
    name: 'Secure',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <a:1_:1157447561339215963> Aimbots, Chams y FixLag.
      <a:2_:1157447558713581678> Minimiza el riesgo de detección y baneo.
      <a:3_:1157447554645102643> Un <@&${roles.VENDOR}> te asesora en la mejor configuración.

      __**VENTAJAS:**__
      - <:compra:1316171968717918379> Alta seguridad y anonimato.\n- <:garantia:1321973733971333150> Garantía de funcionamiento.\n- <:support1:1321973732193075362> Soporte 24/7 disponible.`
  },
  {
    name: 'Aimbot Color',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <a:1_:1157447561339215963> Mejora tu precisión con aimbot por colores.
      <a:2_:1157447558713581678> Configuración ajustable para diferentes juegos.
      <a:3_:1157447554645102643> Un <@&${roles.VENDOR}> te guiará en la instalación.

      __**VENTAJAS:**__
      - <:compra:1316171968717918379> Ventaja competitiva inmediata.\n- <:garantia:1321973733971333150> Configuraciones flexibles.\n- <:support1:1321973732193075362> Soporte 24/7 disponible.`
  },
  {
    name: 'Bypass APK',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <a:1_:1157447561339215963> Bypass indetectable totalmente optimizado para jugar más seguro.
      <a:2_:1157447558713581678> Compatible con múltiples versiones de FF y emuladores.
      <a:3_:1157447554645102643> Un <@&${roles.VENDOR}> te ayuda a instalar sin errores.

      __**VENTAJAS:**__
      - Mayor protección ante baneos <:compra:1316171968717918379>\n- Rendimiento estable <:garantia:1321973733971333150>\n- Soporte 24/7 disponible <:support1:1321973732193075362>
      `
  },
  {
    name: 'Panel iOS',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <a:1_:1157447561339215963> Aimbots y hologramas para iOS.
      <a:2_:1157447558713581678> Máxima estabilidad y rendimiento en cualquier versión de iOS.
      <a:3_:1157447554645102643> Un <@&${roles.VENDOR}> te explicará paso a paso.

      __**VENTAJAS:**__
      - Experiencia fluida en iOS <:compra:1316171968717918379>\n- Integración segura <:garantia:1321973733971333150>\n- Soporte 24/7 disponible <:support1:1321973732193075362>
      `
  },
  {
    name: 'Panel CSGO',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <a:1_:1157447561339215963> Aimbots totalmente configurables.
      <a:2_:1157447558713581678> Granada Helper optimizado para máximo daño.
      <a:3_:1157447554645102643> Stream Mode para ocultar elementos visuales durante transmisiones.

      __**VENTAJAS:**__
      - <:compra:1316171968717918379> Ventaja competitiva en modo competitivo y premier.\n- <:garantia:1321973733971333150> Compatible con Windows 8/10/11.\n- <:support1:1321973732193075362> Soporte 24/7 disponible.`
  },
  {
    name: 'Panel Android',
    image: 'https://i.ibb.co/ZpPQNjG9/Whats-App-Image-2025-12-22-at-8-54-12-PM.jpg',
    description: `
      <a:1_:1157447561339215963> Interfaz intuitiva y fácil de usar.
      <a:2_:1157447558713581678> Acceso a todas las funciones de AIM y visuales.
      <a:3_:1157447554645102643> Personalización completa para adaptarse a tu estilo de juego.

      __**VENTAJAS:**__
      - <:compra:1316171968717918379> Compatible con todas las versiones de Android.\n- <:garantia:1321973733971333150> Experiencia de juego óptima y emocionante.\n- <:support1:1321973732193075362> Soporte 24/7 disponible.`
  }
];

let dailyProduct = null;
let lastProductDate = null;

function getRandomProduct() {
  const index = Math.floor(Math.random() * products.length);
  return products[index];
}

function getDailyProduct() {
  const now = new Date();
  const peruTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
  const currentDate = peruTime.toDateString();

  if (lastProductDate !== currentDate) {
    dailyProduct = getRandomProduct();
    lastProductDate = currentDate;
    console.log(`🎲 Nuevo producto del día seleccionado: ${dailyProduct.name}`);
  }

  return dailyProduct;
}

function isPromoDay() {
  const now = new Date();
  const peruTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
  const day = peruTime.getDay();
  return day === 0 || day === 3 || day === 6;
}

module.exports = {
  name: 'ready',
  once: true,

  async execute(client) {
    const TWO_HOURS = 7200000;

    const sendGeneralMessage = async () => {
      const now = new Date();
      const peruTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
      const hours = peruTime.getHours();

      if (isPromoDay()) {
        console.log('Hoy es día de promoción, saltando mensaje general.');
        return;
      }

      if (hours >= 2 && hours < 7) {
        console.log('Horario restringido (2 AM - 7 AM).');
        return;
      }

      const generalButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_general_es')
          .setLabel('Abrir Ticket')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji({ name: 'soporte', id: '1232042953908949034' }),
        new ButtonBuilder()
          .setLabel('Instagram')
          .setURL('https://www.instagram.com/hypervgg.pe/')
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: 'instagram36', id: '1317355853182926939' }),
        new ButtonBuilder()
          .setLabel('TikTok')
          .setURL('https://www.tiktok.com/@hypervgg')
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: '987340874914619432', id: '1118071042510954548', animated: true }),
        new ButtonBuilder()
          .setLabel('Tienda Online')
          .setURL('https://hyperv.online')
          .setStyle(ButtonStyle.Link)
          .setEmoji({ name: 'website', id: '1459019351410872362' }),
      );

      const channel = await client.channels.fetch(channels.AUTO_MESSAGE);
      await channel.send({
        embeds: [messageEmbed],
        components: [generalButtons]
      });

      console.log('✅ Mensaje general enviado.');
    };

    const sendRandomProductMessage = async () => {
      if (!isPromoDay()) {
        console.log('Hoy NO es día de promoción.');
        return;
      }

      const now = new Date();
      const peruTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
      const hours = peruTime.getHours();

      if (hours >= 2 && hours < 7) {
        console.log('Horario restringido (2 AM - 7 AM).');
        return;
      }

      const product = getDailyProduct();

      const productEmbed = new EmbedBuilder()
        .setTitle(`> ¡${product.name} HyperV en Descuento! <a:flashrayo:1450570834212032746>`)
        .setDescription(product.description)
        .setColor(config.embedColor)
        .setImage(product.image || config.defaultImage)
        .setFooter(config.embedFooter)
        .setTimestamp();

      const promoRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_general_es')
          .setLabel('Abrir Ticket')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji({ name: 'soporte', id: '1232042953908949034' }),
        new ButtonBuilder()
          .setCustomId('promocion')
          .setLabel('Compra aqui')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setLabel('Instagram')
          .setURL('https://www.instagram.com/hypervgg.pe/')
          .setStyle(ButtonStyle.Link)
      );

      const channel = await client.channels.fetch(channels.AUTO_MESSAGE);
      await channel.send({
        content: '@everyone',
        embeds: [productEmbed],
        components: [promoRow]
      });

      console.log(`✅ Promoción de "${product.name}" enviada (${new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' })}).`);
    };

    if (isPromoDay()) {
      console.log('🎉 Día de promoción iniciado.');
      await sendRandomProductMessage();
    } else {
      console.log('💬 Día normal iniciado.');
      await sendGeneralMessage();
    }

    setInterval(async () => {
      if (isPromoDay()) {
        await sendRandomProductMessage();
      } else {
        await sendGeneralMessage();
      }
    }, TWO_HOURS);

    console.log('✅ Sistema automático iniciado.');
    console.log('📅 Promociones: Miércoles/Sábado/Domingo (cada 2h)');
    console.log('💬 Mensajes generales: Resto de días (cada 2h)');
    console.log('🕐 Horario restringido: 2 AM - 7 AM (Perú)');
  }
};