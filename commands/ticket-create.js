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
const { roles } = require('../data/ids');
const { ticketTypeMapping } = require('../data/ticketTypes');
const { ticketClaimButton, ticketCloseButton } = require('../utils/ticketButtons');
const { registerNewTicket } = require('../utils/inactivityChecker');

function sanitize(username) {
    return username.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').slice(0, 20);
}

module.exports = async (interaction) => {
    if (!interaction.isStringSelectMenu() && !interaction.isButton()) {
        return;
    }

    let ticketType;

    if (interaction.isButton()) {
        ticketType = ticketTypeMapping[interaction.customId];
        if (!ticketType) {
            console.log('❌ CustomId no encontrado en ticketTypeMapping:', interaction.customId);
            return;
        }
    } else if (interaction.isStringSelectMenu()) {
        ticketType = interaction.values[0];
    }

    const embed = new EmbedBuilder()
        .setTitle('> HyperV - Ticket')
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setImage(config.defaultImage)
        .setTimestamp();

    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const { channel: parentChannel, guild, user } = interaction;

        const botMember = guild.members.me;
        if (!botMember.permissionsIn(parentChannel).has([
            PermissionFlagsBits.CreatePrivateThreads,
            PermissionFlagsBits.ManageThreads,
            PermissionFlagsBits.ViewChannel
        ])) {
            embed.setDescription('⚠️ No tengo permisos suficientes en este canal para crear el ticket.');
            return await interaction.editReply({ embeds: [embed] });
        }

        const activeThreads = await parentChannel.threads.fetchActive();
        const ticketExistente = activeThreads.threads.find(th =>
            th.name.endsWith(`-${sanitize(user.username)}`)
        );

        if (ticketExistente) {
            const yaExisteEmbed = new EmbedBuilder()
                .setTitle('> HyperV - Ticket')
                .setDescription(
                    `❌ Ya tienes un ticket abierto en este canal.\n\n` +
                    `Debes cerrarlo antes de abrir uno nuevo.\n\n` +
                    `*Haz clic en el botón para ir a tu ticket activo.*`
                )
                .setColor(config.embedColor)
                .setFooter(config.embedFooter)
                .setTimestamp();

            const goToExistingButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Ir a mi Ticket')
                    .setURL(ticketExistente.url)
                    .setStyle(ButtonStyle.Link)
                    .setEmoji('<:soporte:1232042953908949034>')
            );

            return await interaction.editReply({
                embeds: [yaExisteEmbed],
                components: [goToExistingButton]
            });
        }

        const thread = await parentChannel.threads.create({
            name: `📌-${ticketType}-${sanitize(user.username)}`,
            type: ChannelType.PrivateThread,
            invitable: false,
            reason: `Ticket creado por ${user.tag} (${user.id})`,
        });

        // Asegurar membresía explícita del usuario en el hilo privado
        await thread.members.add(user.id).catch(() => { });

        const welcomeEmbed = new EmbedBuilder()
            .setTitle('> HyperV - Ticket')
            .setDescription(
                `Hola <@${user.id}>!\n\nGracias por abrir un ticket de **${ticketType}**. Un staff del equipo te ayudará pronto.\n\n**Por favor proporciona:**\n- Una descripción clara de tu problema o pregunta\n- Cualquier información relevante o capturas de pantalla\n- Nuestro website: [HyperV Store](https://hyperv.online)`
            )
            .setColor(config.embedColor)
            .setThumbnail('https://cdn.discordapp.com/attachments/1231110235171586138/1457816465393848544/ZEUS_AZUL_Y_AMR.png')
            .addFields(
                { name: '<:reloj:1465456666152665209> Tiempo de Respuesta', value: 'Normalmente respondemos en pocos minutos', inline: false },
                { name: '<:soporte:1316466482653171763> ID del Ticket', value: `\`${thread.id}\``, inline: false }
            )
            .setFooter(config.embedFooter);

        await thread.send({
            embeds: [welcomeEmbed],
            components: [ticketClaimButton, ticketCloseButton],
        });

        const pingMessage = await thread.send({
            content: `🔔 ¡Hola <@${user.id}>! Se ha creado tu ticket. Un <@&${roles.VENDOR}> te atenderá en breve.`
        });

        setTimeout(async () => {
            try {
                await pingMessage.delete();
            } catch (err) { }
        }, 5000);

        await registerNewTicket(thread.id);

        const successEmbed = new EmbedBuilder()
            .setTitle('Ticket Creado Exitosamente')
            .setDescription(`Tu ticket de soporte ha sido creado.\n\n*Haz clic en el botón de abajo para acceder a tu ticket.*`)
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        const goToTicketButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Ir al Ticket')
                .setURL(thread.url)
                .setStyle(ButtonStyle.Link)
                .setEmoji('<:soporte:1232042953908949034>')
        );

        await interaction.editReply({
            embeds: [successEmbed],
            components: [goToTicketButton]
        });

    } catch (error) {
        console.error('❌ Error al crear el ticket:', error);
        embed.setDescription('⚠️ Ocurrió un error al intentar crear tu ticket.');
        try {
            await interaction.editReply({ embeds: [embed] });
        } catch (err2) { }
    }
};