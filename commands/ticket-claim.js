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

            const currentName = channel.name;
            const staffName = member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
            const newName = `${staffName}-${currentName}`.slice(0, 100);

            await channel.setName(newName).catch(err =>
                console.error('❌ Error al renombrar el hilo:', err)
            );

            const ownerId = channel.ownerId;

            embed
                .setTitle('> Ticket Reclamado')
                .setDescription(`**${member.user.tag}** será el staff a cargo de este ticket.`);

            await interaction.reply({ embeds: [embed], components: [ticketCloseButton] });

            if (ownerId) {
                const pingMessage = await channel.send({
                    content: `🔔 ¡Hola <@${ownerId}>! <@&${roles.VENDOR}> se ha hecho cargo de tu ticket.`
                });

                setTimeout(async () => {
                    try {
                        await pingMessage.delete();
                    } catch (err) {
                    }
                }, 5000);
            }
        }
    } catch (error) {
        console.error('❌ Error al manejar la interacción:', error);
        if (!interaction.replied && !interaction.deferred) {
            embed.setDescription('⚠️ Ocurrió un error al manejar esta acción. Contacta con un administrador.');
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

module.exports = { main, handleInteraction };