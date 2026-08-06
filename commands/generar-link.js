const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { roles, categories } = require('../data/ids');
const config = require('../data/config');

const STORE_URL = 'https://www.hyperv.online';

const productos = {
  'panel-full': {
    nombre: 'Panel Full',
    url: '/product/panel-full/',
    precio: 'Desde $25.00',
    descripcion: 'Panel completo con todas las funciones sin restricciones',
    categoria: 'FREE FIRE EMULADOR'
  },
  'panel-secure': {
    nombre: 'Panel Secure',
    url: '/product/panel-secure',
    precio: 'Desde $11.00',
    descripcion: 'Panel seguro para Free Fire Emulador',
    categoria: 'FREE FIRE EMULADOR'
  },
  'panel-only-aimbot': {
    nombre: 'Panel Only Aimbot',
    url: '/product/panel-only-aimbot',
    precio: 'Desde $6.00',
    descripcion: 'Panel especializado solo en Aimbot',
    categoria: 'FREE FIRE EMULADOR'
  },
  'bypass-apk': {
    nombre: 'Bypass APK',
    url: '/product/bypass-apk',
    precio: 'Desde $15.00',
    descripcion: 'Bypass para APK Android',
    categoria: 'FREE FIRE EMULADOR'
  },
  'bypass-uid': {
    nombre: 'Bypass UID',
    url: '/product/bypass-uid',
    precio: 'Desde $10.00',
    descripcion: 'Bypass de UID para Free Fire',
    categoria: 'FREE FIRE EMULADOR'
  },
  'menu-chams-esp': {
    nombre: 'Menu Chams ESP',
    url: '/product/menu-chams',
    precio: 'Desde $5.00',
    descripcion: 'Menú de Chams y ESP',
    categoria: 'FREE FIRE EMULADOR'
  },

  'panel-ios': {
    nombre: 'Panel iOS',
    url: '/product/panel-ios',
    precio: 'Desde $15.00',
    descripcion: 'Panel compatible con dispositivos iOS',
    categoria: 'FREE FIRE MOBILE'
  },
  'aimbot-body-ios': {
    nombre: 'Aimbot Body iOS',
    url: '/product/aimbot-body-ios',
    precio: '$65.00 por Temporada',
    descripcion: 'Aimbot al pecho para iOS',
    categoria: 'FREE FIRE MOBILE'
  },
  'aimlock': {
    nombre: 'AimLock',
    url: '/product/aimlock',
    precio: 'Desde $50.00 por 12 meses',
    descripcion: 'Sistema de puntería para iOS',
    categoria: 'FREE FIRE MOBILE'
  },
  'regedit': {
    nombre: 'Regedit',
    url: '/product/regedit',
    precio: 'Desde $25.00',
    descripcion: 'Editor de registro optimizado para iOS & Android',
    categoria: 'FREE FIRE MOBILE'
  },

  'aimbot-color': {
    nombre: 'Aimbot Color',
    url: '/product/aimbot-color',
    precio: 'Desde $25.00',
    descripcion: 'Aimbot basado en colores para Valorant',
    categoria: 'VALORANT'
  },
  'spoofer': {
    nombre: 'Spoofer',
    url: '/product/spoofer',
    precio: '$50.00 permanente',
    descripcion: 'Herramienta de spoofing para Valorant',
    categoria: 'VALORANT'
  },
  'boost-rank': {
    nombre: 'Boost Rank',
    url: '/product/boost-rank',
    precio: 'Desde $10.00',
    descripcion: 'Servicio de rank en Valorant',
    categoria: 'VALORANT'
  },

  'panel-warzone': {
    nombre: 'Panel Warzone',
    url: '/product/panel-warzone',
    precio: 'Desde $30.00',
    descripcion: 'Panel especializado para Warzone',
    categoria: 'WARZONE'
  },

  'discord-tools': {
    nombre: 'Discord Tools',
    url: '/product/discord-tools',
    precio: 'Desde $15.00',
    descripcion: 'Herramientas premium, boosteos y nitro para Discord',
    categoria: 'DISCORD'
  }
};

function isInTicket(interaction) {
  return interaction.channel.parentId === categories.TICKETS;
}

function isVendor(interaction) {
  const userRoles = interaction.member.roles.cache;
  return roles.ADMIN.some(adminId => userRoles.has(adminId)) || 
         userRoles.has(roles.VENDOR) || 
         userRoles.has(roles.SUPPORT);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Genera un enlace directo a un producto de HyperV Store')
    .addStringOption(option =>
      option.setName('producto')
        .setDescription('Selecciona el producto')
        .setRequired(true)
        .addChoices(

          { name: 'Panel Full', value: 'panel-full' },
          { name: 'Panel Secure', value: 'panel-secure' },
          { name: 'Panel Only Aimbot', value: 'panel-only-aimbot' },
          { name: 'Bypass APK', value: 'bypass-apk' },
          { name: 'Bypass UID', value: 'bypass-uid' },
          { name: 'Menu Chams ESP', value: 'menu-chams' },

          { name: 'Panel iOS', value: 'panel-ios' },
          { name: 'Aimbot Body iOS', value: 'aimbot-body-ios' },
          { name: 'AimLock', value: 'aimlock' },
          { name: 'RegEdit', value: 'regedit' },

          { name: 'Aimbot Color', value: 'aimbot-color' },
          { name: 'Spoofer', value: 'spoofer' },
          { name: 'Boost Rank', value: 'boost-rank' },

          { name: 'Panel Warzone', value: 'panel-warzone' },

          { name: 'Discord Tools', value: 'discord-tools' }
        )),

  async execute(interaction) {
    if (!isInTicket(interaction)) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('> HyperV - Error')
        .setDescription('⚠️ Este comando solo puede usarse dentro de un ticket.')
        .setColor(0xFF0000)
        .setFooter(config.embedFooter)
        .setTimestamp();

      return await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true
      });
    }

    if (!isVendor(interaction)) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('> HyperV - Error')
        .setDescription('❌ Solo los vendedores pueden ejecutar este comando.')
        .setColor(0xFF0000)
        .setFooter(config.embedFooter)
        .setTimestamp();

      return await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true
      });
    }

    const productoKey = interaction.options.getString('producto');
    const producto = productos[productoKey];

    if (!producto) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('> HyperV - Error')
        .setDescription('⚠️ Producto no encontrado.')
        .setColor(0xFF0000)
        .setFooter(config.embedFooter)
        .setTimestamp();

      return await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true
      });
    }

    const fullLink = `${STORE_URL}${producto.url}`;

    const linkEmbed = new EmbedBuilder()
      .setTitle(`> ${producto.nombre}`)
      .setDescription(
        `${producto.descripcion}\n\n` +
        `**<:compra:1316466484133757021> Categoría:** ${producto.categoria}\n` +
        `**<:precio:1353642263053336576> Precio:** ${producto.precio}\n\n` +
        `**<:garantia:1321973733971333150> Enlace directo:**\n` +
        `[Click aquí para comprar en HyperV Store](${fullLink})\n\n` +
        `**También puedes copiar el enlace:**\n` +
        `\`${fullLink}\``
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setImage(config.defaultImage)
      .setTimestamp();

    await interaction.reply({
      embeds: [linkEmbed],
      ephemeral: false
    });

    console.log(`🔗 ${interaction.user.tag} generó enlace para: ${producto.nombre}`);
  }
};