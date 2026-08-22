const { EmbedBuilder } = require('discord.js');
const ids = require('../data/ids');
const config = require('../data/config');

const VERIFY_MESSAGE_ID = null;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('🔐 Sistema de verifyUser activo.');

        const verifyChannelId = ids.channels.VERIFY_USER;
        const verifiedRoleId = ids.roles.VERIFIED;

        if (!verifyChannelId) {
            console.error('❌ ids.channels.VERIFY_USER no está configurado en data/ids.js');
            return;
        }

        try {
            const channel = await client.channels.fetch(verifyChannelId);
            if (!channel || !channel.isTextBased()) {
                console.error('❌ Canal de verify-user inválido o no es de texto.');
                return;
            }

            let message;

            if (VERIFY_MESSAGE_ID) {
                message = await channel.messages.fetch(VERIFY_MESSAGE_ID);
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('> HyperV - Verificación')
                    .setDescription(
                        'Reacciona con ✅ a este mensaje para obtener acceso a nuestros **Productos Gratis**.\n\n' +
                        '- Al reaccionar, se te asignará el rol correspondiente.\n' +
                        '- Luego verás la categoría con los productos gratuitos.\n\n' +
                        '- <#1170995306721194044> — Panel Free\n' +
                        '- <#1513956489935720499> — Bypass UID\n'
                    )
                    .setColor(config.embedColor)
                    .setThumbnail(config.embedThumbnail)
                    .setImage(config.defaultImage)
                    .setFooter(config.embedFooter)
                    .setTimestamp();

                message = await channel.send({ embeds: [embed] });
                console.log(`✅ Mensaje de verify creado: ${message.id}`);
                console.log('👉 Copia este ID en VERIFY_MESSAGE_ID dentro de verifyUserPanel.js si quieres fijarlo.');
            }

            const hasCheck = message.reactions.cache.some(r => r.emoji.name === '✅');
            if (!hasCheck) await message.react('✅');

            // Escuchar reacciones en este mensaje
            const collector = message.createReactionCollector({
                filter: () => true, // captura todo
                dispose: true,      // también captura cuando se quita
            });

            collector.on('collect', async (reaction, user) => {
                if (user.bot) return;

                // Si la reacción no es ✅, eliminarla
                if (reaction.emoji.name !== '✅') {
                    await reaction.users.remove(user.id).catch(() => { });
                    return;
                }

                // Asignar rol verificado
                try {
                    const guild = channel.guild;
                    const member = await guild.members.fetch(user.id);
                    if (!member.roles.cache.has(verifiedRoleId)) {
                        await member.roles.add(verifiedRoleId);
                        console.log(`✅ Rol asignado a ${user.tag}`);
                    }
                } catch (err) {
                    console.error(`❌ Error asignando rol a ${user.tag}:`, err);
                }
            });

            collector.on('remove', async (reaction, user) => {
                if (user.bot) return;
                if (reaction.emoji.name !== '✅') return;

                // Quitar rol si se elimina la reacción
                try {
                    const guild = channel.guild;
                    const member = await guild.members.fetch(user.id);
                    if (member.roles.cache.has(verifiedRoleId)) {
                        await member.roles.remove(verifiedRoleId);
                        console.log(`❌ Rol removido de ${user.tag}`);
                    }
                } catch (err) {
                    console.error(`❌ Error removiendo rol de ${user.tag}:`, err);
                }
            });

        } catch (err) {
            console.error('❌ Error preparando el mensaje de verify:', err);
        }
    },
};