const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  PermissionFlagsBits, 
  ChannelType, 
  MessageFlags 
} = require('discord.js');
const config = require('../data/config');
const { registerNewTicket } = require('../utils/inactivityChecker');

const guildTicketCategoryId = '1118077173295763526';
const adminRoleIds = ['1117933070335623280', '1189251231714115715'];
const vendorRoleId = '1117939958653649027';

const ticketClaimButton = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('ticket-claim')
    .setLabel('Reclamar ticket')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('📝')
);

const ticketCloseButton = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('ticket-close')
    .setLabel('Cerrar ticket')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('🔒')
);

module.exports = async (interaction) => {
  console.log(`✅ Procesando botón de promoción para: ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle('> HyperV - Ticket')
    .setColor(config.embedColor)
    .setFooter(config.embedFooter)
    .setImage(config.defaultImage)
    .setTimestamp();

  try {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const { guild, user } = interaction;
    const botMember = guild.members.me;

    if (!botMember.permissions.has([
      PermissionFlagsBits.ManageChannels, 
      PermissionFlagsBits.ViewChannel
    ])) {
      embed.setDescription('⚠️ No tengo permisos suficientes para crear tickets.');
      return await interaction.editReply({ embeds: [embed] });
    }

    // Obtener el nombre del producto desde el embed del mensaje
    const messageEmbed = interaction.message.embeds[0];
    const productName = messageEmbed?.title?.replace('> ¡', '').replace(' HyperV en Descuento! <a:flashrayo:1450570834212032746>', '') || 'promocion';
    const ticketType = productName.toLowerCase().replace(/\s+/g, '-');

    console.log(`🎫 Creando ticket para promoción: ${productName}`);

    const category = guild.channels.cache.get(guildTicketCategoryId);
    if (!category) {
      console.log('❌ Categoría no encontrada:', guildTicketCategoryId);
      embed.setDescription('⚠️ La categoría de tickets no está configurada correctamente.');
      return await interaction.editReply({ embeds: [embed] });
    }

    const adminPermissions = adminRoleIds.map((id) => ({
      id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    }));

    const channel = await guild.channels.create({
      name: `🛒-${ticketType}`,
      type: ChannelType.GuildText,
      parent: guildTicketCategoryId,
      topic: `Ticket creado por ${user.id} | Tipo: ${ticketType}`,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id: user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        ...adminPermissions,
        {
          id: vendorRoleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ],
    });

    console.log('✅ Canal creado exitosamente:', channel.name, channel.id);

    const welcomeEmbed = new EmbedBuilder()
      .setTitle('> HyperV - Ticket')
      .setDescription(
        `Hola <@${user.id}>!\n\nGracias por abrir un ticket de **${ticketType}**. Un staff del equipo te ayudará pronto.\n\n**Por favor proporciona:**\n- Una descripción clara de tu problema o pregunta\n- Cualquier información relevante o capturas de pantalla\n- Nuestro website: [HyperV Store](https://hyperv.online)`
      )
      .setColor(config.embedColor)
      .setThumbnail('https://cdn.discordapp.com/attachments/1231110235171586138/1457816465393848544/ZEUS_AZUL_Y_AMR.png')
      .addFields(
        {
          name: '🎁 Producto en Promoción',
          value: `**${productName}**`,
          inline: false
        },
        {
          name: '<:reloj:1465456666152665209> Tiempo de Respuesta',
          value: 'Normalmente respondemos en pocos minutos',
          inline: false
        },
        {
          name: '<:soporte:1232042953908949034> ID del Ticket',
          value: `\`${channel.id}\``,
          inline: false
        }
      )
      .setFooter(config.embedFooter)
      .setTimestamp();

    await channel.send({
      embeds: [welcomeEmbed],
      components: [ticketClaimButton, ticketCloseButton],
    });

    console.log('✅ Mensaje de bienvenida enviado');

    await registerNewTicket(channel.id);
    console.log(`🎫 Ticket ${channel.id} registrado en sistema de inactividad`);

    const successEmbed = new EmbedBuilder()
      .setTitle('Ticket de Promoción Creado')
      .setDescription(
        `Tu ticket para **${productName}** ha sido creado exitosamente.\n\n` +
        `*Haz clic en el botón de abajo para acceder a tu ticket.*`
      )
      .setColor(config.embedColor)
      .setFooter(config.embedFooter)
      .setTimestamp();

    const goToTicketButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Ir al Ticket')
        .setURL(channel.url)
        .setStyle(ButtonStyle.Link)
        .setEmoji('<:soporte:1232042953908949034>')
    );

    await interaction.editReply({ 
      embeds: [successEmbed], 
      components: [goToTicketButton]
    });

    console.log('✅ Proceso de promoción completado exitosamente');

  } catch (error) {
    console.error('❌ Error al crear el ticket de promoción:', error);
    console.error('❌ Stack completo:', error.stack);

    embed.setDescription('⚠️ Ocurrió un error al intentar crear tu ticket de promoción.');
    
    try {
      await interaction.editReply({ embeds: [embed] });
    } catch (err2) {
      console.error('❌ No se pudo responder, interacción expirada:', err2.message);
    }
  }
};