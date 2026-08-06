const { EmbedBuilder } = require('discord.js');
const ids = require('../data/ids');
const config = require('../data/config');

const VERIFY_MESSAGE_ID = null;

module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async execute(reaction, user, client) {
        if (user.bot) return;

        console.log('🔔 Reacción detectada');
        console.log('   Canal:', reaction.message.channel.id);
        console.log('   Emoji:', reaction.emoji.name);
        console.log('   Mensaje ID:', reaction.message.id);

        const verifyChannelId = ids.channels.VERIFY_USER;
        const bypassRoleId = ids.roles.BYPASS_FREE;

        console.log('   verifyChannelId:', verifyChannelId);
        console.log('   bypassRoleId:', bypassRoleId);

        if (!verifyChannelId || !bypassRoleId) {
            console.log('❌ Saliendo: IDs no configurados');
            return;
        }

        try {
            if (reaction.partial) {
                console.log('⏳ Fetching reacción parcial...');
                await reaction.fetch();
            }
            if (reaction.message.partial) {
                console.log('⏳ Fetching mensaje parcial...');
                await reaction.message.fetch();
            }
        } catch (err) {
            console.error('❌ Error cargando parcial:', err);
            return;
        }

        const message = reaction.message;

        if (!message.guild) {
            console.log('❌ Saliendo: no es un guild');
            return;
        }
        if (message.channel.id !== verifyChannelId) {
            console.log('❌ Saliendo: canal incorrecto', message.channel.id, '!==', verifyChannelId);
            return;
        }
        if (reaction.emoji.name !== '✅') {
            console.log('❌ Saliendo: emoji incorrecto:', reaction.emoji.name);
            return;
        }

        try {
            const guild = message.guild;
            const member = await guild.members.fetch(user.id);
            const role = await guild.roles.fetch(bypassRoleId);

            if (!role) {
                console.error('❌ Rol no encontrado en cache. ID:', bypassRoleId);
                return;
            }

            if (member.roles.cache.has(role.id)) {
                console.log('⚠️ Usuario ya tiene el rol, removiendo reacción...');
                await reaction.users.remove(user.id).catch(err => console.error('❌ Error removiendo reacción:', err));
                return;
            }

            console.log('✅ Asignando rol...');
            await member.roles.add(role);
            console.log('✅ Rol asignado, removiendo reacción...');
            await reaction.users.remove(user.id).catch(err => console.error('❌ Error removiendo reacción:', err));
            console.log('✅ Reacción removida');

        } catch (err) {
            console.error('❌ Error general:', err);
        }
    }
};