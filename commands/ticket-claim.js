const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { categories, roles } = require('../data/ids');
const config = require('../data/config');
const { ticketCloseButton } = require('../utils/ticketButtons');

async function main(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('> HyperV - Ticket')
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setTimestamp();

    const { channel, member } = interaction;

    try {
        if (channel.parentId !== categories.TICKETS) {
            embed.setDescription('⚠️ Este canal no está en la categoría de tickets.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const isAdmin = roles.ADMIN.some(roleId => member.roles.cache.has(roleId));
        const isVendor = member.roles.cache.has(roles.VENDOR);

        if (!isVendor && !isAdmin) {
            embed.setDescription('⚠️ No tienes permisos para gestionar este ticket.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await handleInteraction(interaction);
    } catch (error) {
        console.error('❌ Error al gestionar el ticket:', error);
        embed.setDescription('⚠️ Ocurrió un error al gestionar este ticket. Contacta con un administrador.');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

async function handleInteraction(interaction) {
    if (!interaction.isButton()) return;

    const embed = new EmbedBuilder()
        .setTitle('> Ticket')
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setTimestamp();

    const { customId, channel, member, guild } = interaction;

    try {
        const ticketCreatorId = channel.topic?.match(/\d{17,19}/)?.[0];
        
        if (!ticketCreatorId) {
            embed.setDescription('⚠️ No se pudo encontrar al creador del ticket.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const creator = await guild.members.fetch(ticketCreatorId).catch(() => null);
        
        if (!creator) {
            embed.setDescription('⚠️ El creador del ticket no está disponible.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const permissions = channel.permissionOverwrites.cache;
        const claimedBy = permissions.find(p =>
            p.type === 1 &&
            p.id !== ticketCreatorId &&
            p.allow.has(PermissionsBitField.Flags.SendMessages)
        )?.id;

        const isAdmin = roles.ADMIN.some(roleId => member.roles.cache.has(roleId));
        const isVendor = member.roles.cache.has(roles.VENDOR);

        if (customId === 'ticket-claim') {
            if (!isVendor && !isAdmin) {
                embed.setDescription('⚠️ No tienes permisos para reclamar este ticket. Solo el staff puede hacerlo.');
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (claimedBy && claimedBy !== member.id) {
                embed.setDescription('⚠️ Este ticket ya fue reclamado por otro usuario.');
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await channel.permissionOverwrites.set([
                {
                    id: channel.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: member.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ]
                },
                {
                    id: ticketCreatorId,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ]
                }
            ]);

            const currentName = channel.name;
            const staffName = member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
            const newName = `${staffName}-${currentName}`;

            await channel.setName(newName).catch(err => 
                console.error('❌ Error al renombrar el canal:', err)
            );
            embed
                .setTitle('> Ticket Reclamado')
                .setDescription(`**${member.user.tag}** sera el staff a cargo de este ticket.`);
            await interaction.reply({ embeds: [embed], components: [ticketCloseButton] });
        }
    } catch (error) {
        console.error('❌ Error al manejar la interacción:', error);
        embed.setDescription('⚠️ Ocurrió un error al manejar esta acción. Contacta con un administrador.');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

module.exports = { main, handleInteraction };