const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { categories, roles } = require('../data/ids');
const config = require('../data/config');
const { unregisterTicket } = require('../utils/inactivityChecker');

async function main(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('> HyperV - Ticket')
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setTimestamp();

    const { channel, guild, member, user } = interaction;

    try {
        if (channel.parentId !== categories.TICKETS) {
            embed.setDescription('⚠️ Este canal no es un ticket.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const botMember = guild.members.me;
        if (!botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
            console.error('El bot no tiene permisos para gestionar canales.');
            embed.setDescription('⚠️ No tengo permisos para borrar este canal.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const ticketCreatorId = channel.topic?.match(/\d{17,19}/)?.[0];
        
        if (!ticketCreatorId) {
            embed.setDescription('⚠️ No se pudo identificar al creador del ticket.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const permissions = channel.permissionOverwrites.cache;
        const claimedBy = permissions.find(p =>
            p.type === 1 &&
            p.id !== ticketCreatorId &&
            p.allow.has(PermissionsBitField.Flags.SendMessages)
        )?.id;

        const isAdmin = roles.ADMIN.some(roleId => member.roles.cache.has(roleId));
        const isClaimer = user.id === claimedBy;

        if (!isAdmin && !isClaimer) {
            embed.setDescription('❌ Solo el vendedor que reclamó el ticket o un administrador pueden cerrarlo.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        embed.setDescription('<:candado:1465454456236675345> El ticket será cerrado en 4 segundos.');
        await interaction.reply({ embeds: [embed], ephemeral: true });

        const closeEmbed = new EmbedBuilder()
            .setTitle('> HyperV - Cierre de Ticket')
            .setDescription(`El ticket está siendo cerrado por <@${user.id}> (${user.tag}).`)
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        await channel.send({ embeds: [closeEmbed] });
        await unregisterTicket(channel.id);

        setTimeout(() => {
            channel.delete().catch(err => console.error('Error al eliminar el canal:', err));
        }, 4000);

    } catch (error) {
        console.error('Error general al cerrar el ticket:', error);
        if (!interaction.replied && !interaction.deferred) {
            embed.setDescription('⚠️ Ocurrió un error al intentar cerrar este ticket.');
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

module.exports = main;