const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { roles } = require('../data/ids');
const config = require('../data/config');
const { unregisterTicket } = require('../utils/inactivityChecker');
const { getClaim, removeClaim } = require('../utils/ticketClaims');

async function main(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('> HyperV - Ticket')
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setTimestamp();

    const { channel, guild, member, user } = interaction;

    try {
        if (!channel.isThread()) {
            embed.setDescription('⚠️ Este canal no es un ticket.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const adminList = Array.isArray(roles.ADMIN) ? roles.ADMIN : [roles.ADMIN];
        const isAdmin = adminList.some(roleId => member.roles.cache.has(roleId));

        const claimedBy = getClaim(channel.id);
        const isClaimer = claimedBy === user.id;

        // ❌ SI NO ES ADMIN NI EL VENDEDOR QUE RECLAMÓ, BLOQUEAR
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

        try {
            const vendorList = Array.isArray(roles.VENDOR) ? roles.VENDOR : [roles.VENDOR];
            for (const roleId of vendorList) {
                if (!roleId) continue;
                await channel.permissionOverwrites.delete(roleId).catch(() => { });
            }
            if (claimedBy) {
                await channel.permissionOverwrites.delete(claimedBy).catch(() => { });
            }
        } catch (err) {
            console.error('❌ Error al limpiar permisos del ticket:', err);
        }

        removeClaim(channel.id);

        setTimeout(() => {
            channel.delete().catch(err => console.error('Error al eliminar el hilo:', err));
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