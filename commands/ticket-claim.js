const { EmbedBuilder } = require('discord.js');
const { roles } = require('../data/ids');
const config = require('../data/config');
const { ticketCloseButton } = require('../utils/ticketButtons');
const { setClaim, getClaim } = require('../utils/ticketClaims');

async function main(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('> HyperV - Ticket')
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setTimestamp();

    const { channel, member } = interaction;

    try {
        if (!channel.isThread()) {
            embed.setDescription('⚠️ Este comando solo funciona dentro de un ticket (hilo).');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const adminList = Array.isArray(roles.ADMIN) ? roles.ADMIN : [roles.ADMIN];
        const vendorList = Array.isArray(roles.VENDOR) ? roles.VENDOR : [roles.VENDOR];

        const isAdmin = adminList.some(roleId => member.roles.cache.has(roleId));
        const isVendor = vendorList.some(roleId => member.roles.cache.has(roleId));

        if (!isVendor && !isAdmin) {
            embed.setDescription('❌ No tienes permisos para gestionar este ticket.');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await handleInteraction(interaction);
    } catch (error) {
        console.error('❌ Error al gestionar el ticket:', error);
        embed.setDescription('⚠️ Ocurrió un error al gestionar este ticket.');
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

async function handleInteraction(interaction) {
    if (!interaction.isButton()) return;

    const embed = new EmbedBuilder()
        .setTitle('> Ticket')
        .setColor(config.embedColor)
        .setFooter(config.embedFooter)
        .setTimestamp();

    const { customId, channel, member } = interaction;

    try {
        if (customId === 'ticket-claim') {
            const claimedBy = getClaim(channel.id);

            if (claimedBy && claimedBy !== member.id) {
                embed.setDescription('⚠️ Este ticket ya fue reclamado por otro vendedor.');
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            setClaim(channel.id, member.id);
            await channel.members.add(member.id);

            if (channel.ownerId) {
                await channel.members.add(channel.ownerId).catch(() => { });
            }

            const currentName = channel.name;
            const staffName = member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
            const newName = `${staffName}-${currentName}`.slice(0, 100);

            await channel.setName(newName).catch(err =>
                console.error('❌ Error al renombrar el hilo:', err)
            );

            if (channel.ownerId) {
                await channel.members.add(channel.ownerId).catch(() => { });
            }

            embed
                .setTitle('> Ticket Reclamado')
                .setDescription(`**${member.user.tag}** será el staff a cargo de este ticket.`);
            await interaction.reply({ embeds: [embed], components: [ticketCloseButton] });
        }
    } catch (error) {
        console.error('❌ Error al manejar la interacción:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

module.exports = { main, handleInteraction };