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
        } catch (err) {
            console.error('❌ Error preparando el mensaje de verify:', err);
        }
    },
};