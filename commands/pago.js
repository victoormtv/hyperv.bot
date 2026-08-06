const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { roles, categories } = require('../data/ids');
const config = require('../data/config');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const preference = new Preference(client);

const productos = {
  // PANEL FULL
  'panel-full-semanal': {
    nombre: 'Panel Full Semanal',
    precioUSD: 25.00,
    precioPEN: 60.00,
    descripcion: 'Panel completo con todas las funciones - 7 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'panel-full-mensual': {
    nombre: 'Panel Full Mensual',
    precioUSD: 40.00,
    precioPEN: 110.00,
    descripcion: 'Panel completo con todas las funciones - 30 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'panel-full-trimestral': {
    nombre: 'Panel Full Trimestral',
    precioUSD: 50.00,
    precioPEN: 150.00,
    descripcion: 'Panel completo con todas las funciones - 90 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'panel-full-anual': {
    nombre: 'Panel Full Anual',
    precioUSD: 65.00,
    precioPEN: 200.00,
    descripcion: 'Panel completo con todas las funciones - 365 días',
    categoria: 'FREE FIRE EMULADOR'
  },

  // PANEL BASIC
  'basic-semanal': {
    nombre: 'Panel Basic Semanal',
    precioUSD: 11.00,
    precioPEN: 40.00,
    descripcion: 'Panel básico seguro - 7 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'basic-mensual': {
    nombre: 'Panel Basic Mensual',
    precioUSD: 22.00,
    precioPEN: 80.00,
    descripcion: 'Panel básico seguro - 30 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'basic-trimestral': {
    nombre: 'Panel Basic Trimestral',
    precioUSD: 32.00,
    precioPEN: 120.00,
    descripcion: 'Panel básico seguro - 90 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'basic-anual': {
    nombre: 'Panel Basic Anual',
    precioUSD: 40.00,
    precioPEN: 150.00,
    descripcion: 'Panel básico seguro - 365 días',
    categoria: 'FREE FIRE EMULADOR'
  },

  // BYPASS ID
  'bypass-id-semanal': {
    nombre: 'Bypass ID Semanal',
    precioUSD: 10.00,
    precioPEN: 40.00,
    descripcion: 'Bypass de ID - 7 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'bypass-id-catorce-dias': {
    nombre: 'Bypass ID 14 días',
    precioUSD: 20.00,
    precioPEN: 70.00,
    descripcion: 'Bypass de ID - 14 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'bypass-id-mensual': {
    nombre: 'Bypass ID 30 días',
    precioUSD: 30.00,
    precioPEN: 100.00,
    descripcion: 'Bypass de ID - 30 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'bypass-id-60-dias': {
    nombre: 'Bypass ID 60 días',
    precioUSD: 45.00,
    precioPEN: 150.00,
    descripcion: 'Bypass de ID - 60 días',
    categoria: 'FREE FIRE EMULADOR'
  },

  // PANEL ONLY AIMBOT
  'panel-only-aimbot-semanal': {
    nombre: 'Panel Only Aimbot Semanal',
    precioUSD: 6.00,
    precioPEN: 20.00,
    descripcion: 'Panel especializado solo en Aimbot - 7 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'panel-only-aimbot-mensual': {
    nombre: 'Panel Only Aimbot Mensual',
    precioUSD: 15.00,
    precioPEN: 55.00,
    descripcion: 'Panel especializado solo en Aimbot - 30 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'panel-only-aimbot-trimestral': {
    nombre: 'Panel Only Aimbot Trimestral',
    precioUSD: 25.00,
    precioPEN: 90.00,
    descripcion: 'Panel especializado solo en Aimbot - 90 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'panel-only-aimbot-anual': {
    nombre: 'Panel Only Aimbot Anual',
    precioUSD: 30.00,
    precioPEN: 130.00,
    descripcion: 'Panel especializado solo en Aimbot - 365 días',
    categoria: 'FREE FIRE EMULADOR'
  },

  // MENU CHAMS
  'chams-semanal': {
    nombre: 'Menu Chams Semanal',
    precioUSD: 5.00,
    precioPEN: 25.00,
    descripcion: 'Menú de Chams y ESP - 7 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'chams-mensual': {
    nombre: 'Menu Chams Mensual',
    precioUSD: 15.00,
    precioPEN: 50.00,
    descripcion: 'Menú de Chams y ESP - 30 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'chams-trimestral': {
    nombre: 'Menu Chams Trimestral',
    precioUSD: 20.00,
    precioPEN: 70.00,
    descripcion: 'Menú de Chams y ESP - 90 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'chams-anual': {
    nombre: 'Menu Chams Anual',
    precioUSD: 25.00,
    precioPEN: 90.00,
    descripcion: 'Menú de Chams y ESP - 365 días',
    categoria: 'FREE FIRE EMULADOR'
  },

  // BYPASS APK
  'bypass-apk-semanal': {
    nombre: 'Bypass APK Semanal',
    precioUSD: 15.00,
    precioPEN: 60.00,
    descripcion: 'Bypass para APK Android - 7 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'bypass-apk-14-dias': {
    nombre: 'Bypass APK 14 días',
    precioUSD: 20.00,
    precioPEN: 80.00,
    descripcion: 'Bypass para APK Android - 14 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'bypass-apk-mensual': {
    nombre: 'Bypass APK Mensual',
    precioUSD: 35.00,
    precioPEN: 130.00,
    descripcion: 'Bypass para APK Android - 30 días',
    categoria: 'FREE FIRE EMULADOR'
  },
  'bypass-apk-trimestral': {
    nombre: 'Bypass APK Trimestral',
    precioUSD: 50.00,
    precioPEN: 180.00,
    descripcion: 'Bypass para APK Android - 90 días',
    categoria: 'FREE FIRE EMULADOR'
  },

  // PANEL iOS
  'panel-ios-24-horas': {
    nombre: 'Panel iOS 24 horas',
    precioUSD: 15.00,
    precioPEN: 55.00,
    descripcion: 'Panel para iOS - 24 horas',
    categoria: 'FREE FIRE MOBILE'
  },
  'panel-ios-1-semana': {
    nombre: 'Panel iOS Semanal',
    precioUSD: 30.00,
    precioPEN: 100.00,
    descripcion: 'Panel para iOS - 7 días',
    categoria: 'FREE FIRE MOBILE'
  },
  'panel-ios-1-mes': {
    nombre: 'Panel iOS Mensual',
    precioUSD: 50.00,
    precioPEN: 180.00,
    descripcion: 'Panel para iOS - 30 días',
    categoria: 'FREE FIRE MOBILE'
  },

  // AIMBOT BODY iOS
  'aimbot-body-ios': {
    nombre: 'Aimbot Body iOS',
    precioUSD: 65.00,
    precioPEN: 200.00,
    descripcion: 'Aimbot al pecho para iOS - Temporada completa',
    categoria: 'FREE FIRE MOBILE'
  },

  // PANEL ANDROID
  'panel-android-semanal': {
    nombre: 'Panel Android Semanal',
    precioUSD: 10.00,
    precioPEN: 35.00,
    descripcion: 'Panel para Android - 7 días',
    categoria: 'FREE FIRE MOBILE'
  },
  'panel-android-14-dias': {
    nombre: 'Panel Android 14 días',
    precioUSD: 17.00,
    precioPEN: 60.00,
    descripcion: 'Panel para Android - 14 días',
    categoria: 'FREE FIRE MOBILE'
  },
  'panel-android-mensual': {
    nombre: 'Panel Android Mensual',
    precioUSD: 30.00,
    precioPEN: 100.00,
    descripcion: 'Panel para Android - 30 días',
    categoria: 'FREE FIRE MOBILE'
  },
  'panel-android-60-dias': {
    nombre: 'Panel Android 60 días',
    precioUSD: 45.00,
    precioPEN: 150.00,
    descripcion: 'Panel para Android - 60 días',
    categoria: 'FREE FIRE MOBILE'
  },

  // AIMLOCK
  'aimlock': {
    nombre: 'Aimlock Anual',
    precioUSD: 50.00,
    precioPEN: 180.00,
    descripcion: 'Sistema de puntería para iOS - 365 días',
    categoria: 'FREE FIRE MOBILE'
  },

  // REGEDIT
  'Regedit-mensual': {
    nombre: 'Regedit Mensual',
    precioUSD: 25.00,
    precioPEN: 80.00,
    descripcion: 'Editor de registro optimizado - 30 días',
    categoria: 'FREE FIRE MOBILE'
  },
  'Regedit-anual': {
    nombre: 'Regedit Anual',
    precioUSD: 35.00,
    precioPEN: 130.00,
    descripcion: 'Editor de registro optimizado - 365 días',
    categoria: 'FREE FIRE MOBILE'
  },

  // AIMBOT COLOR (VALORANT)
  'aimbot-color-semanal': {
    nombre: 'Aimbot Color Semanal',
    precioUSD: 25.00,
    precioPEN: 90.00,
    descripcion: 'Aimbot basado en colores para Valorant - 7 días',
    categoria: 'VALORANT'
  },
  'aimbot-color-mensual': {
    nombre: 'Aimbot Color Mensual',
    precioUSD: 50.00,
    precioPEN: 180.00,
    descripcion: 'Aimbot basado en colores para Valorant - 30 días',
    categoria: 'VALORANT'
  },
  'aimbot-color-trimestral': {
    nombre: 'Aimbot Color Trimestral',
    precioUSD: 90.00,
    precioPEN: 300.00,
    descripcion: 'Aimbot basado en colores para Valorant - 90 días',
    categoria: 'VALORANT'
  },

  // SPOOFER
  'spoofer-permanente': {
    nombre: 'Spoofer Permanente',
    precioUSD: 50.00,
    precioPEN: 200.00,
    descripcion: 'Herramienta de spoofing para Valorant - Permanente',
    categoria: 'VALORANT'
  },

  // PANEL CSGO
  'panel-csgo-semanal': {
    nombre: 'Panel CSGO Semanal',
    precioUSD: 20.00,
    precioPEN: 70.00,
    descripcion: 'Panel especializado para CSGO - 7 días',
    categoria: 'CSGO'
  },
  'panel-csgo-mensual': {
    nombre: 'Panel CSGO Mensual',
    precioUSD: 45.00,
    precioPEN: 160.00,
    descripcion: 'Panel especializado para CSGO - 30 días',
    categoria: 'CSGO'
  },

  // PANEL COD iOS
  'panel-cod-1-dia': {
    nombre: 'Panel COD iOS 1 día',
    precioUSD: 15.00,
    precioPEN: 50.00,
    descripcion: 'Panel para Call of Duty iOS - 24 horas',
    categoria: 'CALL OF DUTY'
  },
  'panel-cod-semanal': {
    nombre: 'Panel COD iOS Semanal',
    precioUSD: 30.00,
    precioPEN: 100.00,
    descripcion: 'Panel para Call of Duty iOS - 7 días',
    categoria: 'CALL OF DUTY'
  },
  'panel-cod-mensual': {
    nombre: 'Panel COD iOS Mensual',
    precioUSD: 50.00,
    precioPEN: 170.00,
    descripcion: 'Panel para Call of Duty iOS - 30 días',
    categoria: 'CALL OF DUTY'
  },

  // PANEL WARZONE
  'panel-warzone-quince-dias': {
    nombre: 'Panel Warzone 15 días',
    precioUSD: 30.00,
    precioPEN: 110.00,
    descripcion: 'Panel especializado para Warzone - 15 días',
    categoria: 'WARZONE'
  },
  'panel-warzone-treinta-dias': {
    nombre: 'Panel Warzone 30 días',
    precioUSD: 65.00,
    precioPEN: 200.00,
    descripcion: 'Panel especializado para Warzone - 30 días',
    categoria: 'WARZONE'
  },

  // NITRO & BOOSTER
  'nitro-1-año': {
    nombre: 'Discord Nitro x1 año',
    precioUSD: 60.00,
    precioPEN: 240.00,
    descripcion: 'Discord Nitro anual',
    categoria: 'DISCORD'
  },
  '14-boost-x1-mes': {
    nombre: '14 Boost x1 mes',
    precioUSD: 30.00,
    precioPEN: 110.00,
    descripcion: '14 Server Boosts por 1 mes',
    categoria: 'DISCORD'
  },
  '14-boost-x3-mes': {
    nombre: '14 Boost x3 mes',
    precioUSD: 60.00,
    precioPEN: 240.00,
    descripcion: '14 Server Boosts por 3 meses',
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
    .setName('pago')
    .setDescription('Genera un link de pago mediante Mercado Pago')
    .addStringOption(option =>
      option.setName('producto')
        .setDescription('Selecciona el producto')
        .setRequired(true)
        .addChoices(
          // PANEL FULL
          { name: 'Panel Full Semanal - $25 | S/.60', value: 'panel-full-semanal' },
          { name: 'Panel Full Mensual - $40 | S/.110', value: 'panel-full-mensual' },
          { name: 'Panel Full Trimestral - $50 | S/.150', value: 'panel-full-trimestral' },
          { name: 'Panel Full Anual - $65 | S/.200', value: 'panel-full-anual' },
          
          // PANEL BASIC
          { name: 'Panel Basic Semanal - $11 | S/.40', value: 'basic-semanal' },
          { name: 'Panel Basic Mensual - $22 | S/.80', value: 'basic-mensual' },
          { name: 'Panel Basic Trimestral - $32 | S/.120', value: 'basic-trimestral' },
          { name: 'Panel Basic Anual - $40 | S/.150', value: 'basic-anual' },
          
          // BYPASS ID
          { name: 'Bypass ID Semanal - $10 | S/.40', value: 'bypass-id-semanal' },
          { name: 'Bypass ID 14 días - $20 | S/.70', value: 'bypass-id-catorce-dias' },
          { name: 'Bypass ID 30 días - $30 | S/.100', value: 'bypass-id-mensual' },
          { name: 'Bypass ID 60 días - $45 | S/.150', value: 'bypass-id-60-dias' },
          
          // PANEL ONLY AIMBOT
          { name: 'Panel Only Aimbot Semanal - $6 | S/.20', value: 'panel-only-aimbot-semanal' },
          { name: 'Panel Only Aimbot Mensual - $15 | S/.55', value: 'panel-only-aimbot-mensual' },
          { name: 'Panel Only Aimbot Trimestral - $25 | S/.90', value: 'panel-only-aimbot-trimestral' },
          { name: 'Panel Only Aimbot Anual - $30 | S/.130', value: 'panel-only-aimbot-anual' },
          
          // MENU CHAMS
          { name: 'Menu Chams Semanal - $5 | S/.25', value: 'chams-semanal' },
          { name: 'Menu Chams Mensual - $15 | S/.50', value: 'chams-mensual' },
          { name: 'Menu Chams Trimestral - $20 | S/.70', value: 'chams-trimestral' },
          { name: 'Menu Chams Anual - $25 | S/.90', value: 'chams-anual' }
        ))
    .addStringOption(option =>
      option.setName('moneda')
        .setDescription('Selecciona la moneda de pago')
        .setRequired(true)
        .addChoices(
          { name: 'Dólares (USD)', value: 'USD' },
          { name: 'Soles Peruanos (PEN)', value: 'PEN' }
        ))
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de unidades (por defecto: 1)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10)),

  async execute(interaction) {
    // Validaciones
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

    await interaction.deferReply();

    const productoKey = interaction.options.getString('producto');
    const moneda = interaction.options.getString('moneda');
    const cantidad = interaction.options.getInteger('cantidad') || 1;
    const producto = productos[productoKey];

    if (!producto) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('> HyperV - Error')
        .setDescription('⚠️ Producto no encontrado.')
        .setColor(0xFF0000)
        .setFooter(config.embedFooter)
        .setTimestamp();

      return await interaction.editReply({ embeds: [errorEmbed] });
    }

    const precio = moneda === 'USD' ? producto.precioUSD : producto.precioPEN;
    const total = precio * cantidad;
    const simboloMoneda = moneda === 'USD' ? '$' : 'S/.';

    try {
      const body = {
        items: [
          {
            id: productoKey,
            title: producto.nombre,
            description: producto.descripcion,
            category_id: producto.categoria,
            quantity: cantidad,
            currency_id: moneda,
            unit_price: precio
          }
        ],
        back_urls: {
          success: 'https://www.hyperv.online/success',
          failure: 'https://www.hyperv.online/failure',
          pending: 'https://www.hyperv.online/pending'
        },
        auto_return: 'approved',
        external_reference: `${interaction.user.id}-${Date.now()}`,
        statement_descriptor: 'HyperV Store',
        metadata: {
          discord_user_id: interaction.user.id,
          discord_username: interaction.user.tag,
          ticket_id: interaction.channel.id,
          producto: producto.nombre
        }
      };

      const response = await preference.create({ body });

      const pagoEmbed = new EmbedBuilder()
        .setTitle(`> Link de Mercado Pago Generado`)
        .setDescription(
          `**${producto.nombre}**\n` +
          `${producto.descripcion}\n\n` +
          `**<:compra:1316171968717918379> Categoría:** ${producto.categoria}\n` +
          `- **Precio unitario:** ${simboloMoneda}${precio.toFixed(2)}\n` +
          `- **Cantidad:** ${cantidad}\n` +
          `**Total a pagar:** ${simboloMoneda}${total.toFixed(2)} ${moneda}\n\n` +
          `**🔗 Haz clic aquí para pagar:**\n` +
          `[Pagar con Mercado Pago](${response.init_point})\n\n` +
          `\`\`\`${response.init_point}\`\`\`\n` +
          `- **ID de Pago:** \`${response.id}\``
        )
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setImage(config.defaultImage)
        .setTimestamp();

      await interaction.editReply({ embeds: [pagoEmbed] });

      console.log(`💳 ${interaction.user.tag} generó link de pago | Producto: ${producto.nombre} | Cantidad: ${cantidad} | Total: ${simboloMoneda}${total.toFixed(2)} ${moneda} | ID: ${response.id}`);

    } catch (error) {
      console.error('Error al generar link de pago:', error);

      const errorEmbed = new EmbedBuilder()
        .setTitle('> HyperV - Error')
        .setDescription(
          '❌ Hubo un error al generar el link de pago.\n\n' +
          '**Posibles causas:**\n' +
          '- Token de Mercado Pago inválido\n' +
          '- Problemas de conexión con la API\n' +
          '- Configuración incorrecta\n\n' +
          'Por favor, contacta al administrador.'
        )
        .setColor(0xFF0000)
        .setFooter(config.embedFooter)
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
