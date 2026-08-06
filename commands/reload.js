const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../data/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Recarga comandos, eventos, utilidades o datos sin reiniciar el bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('command')
                .setDescription('Recarga un comando específico')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del comando a recargar')
                        .setRequired(true)
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('all-commands')
                .setDescription('Recarga todos los comandos'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('event')
                .setDescription('Recarga un evento específico')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del evento a recargar')
                        .setRequired(true)
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('util')
                .setDescription('Recarga un archivo de utilidades')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del archivo de utilidad')
                        .setRequired(true)
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('data')
                .setDescription('Recarga un archivo de datos (.js)')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del archivo de datos')
                        .setRequired(true)
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('everything')
                .setDescription('Recarga ABSOLUTAMENTE TODO (comandos, eventos, utils, data)')),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        const subcommand = interaction.options.getSubcommand();

        let choices = [];

        try {
            if (subcommand === 'command' && focusedOption.name === 'nombre') {
                const commandsPath = path.join(__dirname, '.');
                const commandFiles = fs.readdirSync(commandsPath)
                    .filter(file => file.endsWith('.js') && file !== 'reload.js')
                    .map(file => file.replace('.js', ''));
                choices = commandFiles;
            }

            if (subcommand === 'event' && focusedOption.name === 'nombre') {
                const eventsPath = path.join(__dirname, '../events');
                if (fs.existsSync(eventsPath)) {
                    const eventFiles = fs.readdirSync(eventsPath)
                        .filter(file => file.endsWith('.js'))
                        .map(file => file.replace('.js', ''));
                    choices = eventFiles;
                }
            }

            if (subcommand === 'util' && focusedOption.name === 'nombre') {
                const utilsPath = path.join(__dirname, '../utils');
                if (fs.existsSync(utilsPath)) {
                    const utilFiles = fs.readdirSync(utilsPath)
                        .filter(file => file.endsWith('.js'))
                        .map(file => file.replace('.js', ''));
                    choices = utilFiles;
                }
            }

            if (subcommand === 'data' && focusedOption.name === 'nombre') {
                const dataPath = path.join(__dirname, '../data');
                if (fs.existsSync(dataPath)) {
                    const dataFiles = fs.readdirSync(dataPath)
                        .filter(file => file.endsWith('.js'))
                        .map(file => file.replace('.js', ''));
                    choices = dataFiles;
                }
            }

            const filtered = choices.filter(choice => 
                choice.toLowerCase().includes(focusedOption.value.toLowerCase())
            ).slice(0, 25);

            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice }))
            );
        } catch (error) {
            console.error('Error en autocomplete:', error);
            await interaction.respond([]);
        }
    },

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const subcommand = interaction.options.getSubcommand();
        const startTime = Date.now();

        if (subcommand === 'command') {
            const commandName = interaction.options.getString('nombre');
            const command = interaction.client.commands.get(commandName);

            if (!command) {
                return interaction.editReply({ 
                    content: `❌ No existe el comando \`${commandName}\`` 
                });
            }

            const commandPath = path.join(__dirname, `./${commandName}.js`);
            
            if (!fs.existsSync(commandPath)) {
                return interaction.editReply({ 
                    content: `❌ No se encuentra el archivo \`${commandName}.js\` en la carpeta de comandos` 
                });
            }

            delete require.cache[require.resolve(commandPath)];

            try {
                const newCommand = require(commandPath);
                
                if (!newCommand.data || !newCommand.execute) {
                    return interaction.editReply({ 
                        content: `❌ El comando \`${commandName}\` no tiene la estructura correcta (falta data o execute)` 
                    });
                }

                interaction.client.commands.set(newCommand.data.name, newCommand);
                
                const elapsed = Date.now() - startTime;
                const embed = new EmbedBuilder()
                    .setTitle('> Comando Recargado')
                    .setDescription(`**Comando:** \`${commandName}\`\n**Tiempo:** ${elapsed}ms`)
                    .setColor(config.embedColor)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ 
                    content: `❌ Error al recargar \`${commandName}\`:\n\`\`\`${error.message}\`\`\`` 
                });
            }
        }

        if (subcommand === 'all-commands') {
            const commandsPath = path.join(__dirname, '.');
            const commandFiles = fs.readdirSync(commandsPath)
                .filter(file => file.endsWith('.js'));

            let reloadedCount = 0;
            let errors = [];

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)];

                try {
                    const command = require(filePath);
                    if ('data' in command && 'execute' in command) {
                        interaction.client.commands.set(command.data.name, command);
                        reloadedCount++;
                    }
                } catch (error) {
                    errors.push(`${file}: ${error.message}`);
                }
            }

            const elapsed = Date.now() - startTime;
            const embed = new EmbedBuilder()
                .setTitle(errors.length > 0 ? '⚠️ Comandos Recargados con Errores' : '✅ Todos los Comandos Recargados')
                .setDescription(
                    `**Recargados:** ${reloadedCount}\n` +
                    `**Errores:** ${errors.length}\n` +
                    `**Tiempo:** ${elapsed}ms` +
                    (errors.length > 0 ? `\n\n**Detalles de errores:**\n\`\`\`${errors.join('\n').substring(0, 1000)}\`\`\`` : '')
                )
                .setColor(errors.length > 0 ? '#FFA500' : '#00FF00')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }

        if (subcommand === 'event') {
            const eventName = interaction.options.getString('nombre');
            const eventPath = path.join(__dirname, `../events/${eventName}.js`);

            if (!fs.existsSync(eventPath)) {
                return interaction.editReply({ 
                    content: `❌ No existe el evento \`${eventName}\` en la carpeta events` 
                });
            }

            delete require.cache[require.resolve(eventPath)];

            try {
                const event = require(eventPath);
                
                if (!event.name || !event.execute) {
                    return interaction.editReply({ 
                        content: `❌ El evento \`${eventName}\` no tiene la estructura correcta (falta name o execute)` 
                    });
                }
                
                interaction.client.removeAllListeners(event.name);

                if (event.once) {
                    interaction.client.once(event.name, (...args) => event.execute(...args, interaction.client));
                } else {
                    interaction.client.on(event.name, (...args) => event.execute(...args, interaction.client));
                }

                const elapsed = Date.now() - startTime;
                const embed = new EmbedBuilder()
                    .setTitle('> Evento Recargado')
                    .setDescription(
                        `**Evento:** \`${eventName}\`\n` +
                        `**Tipo:** ${event.once ? 'Once' : 'On'}\n` +
                        `**Tiempo:** ${elapsed}ms`
                    )
                    .setColor(config.embedColor)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ 
                    content: `❌ Error al recargar \`${eventName}\`:\n\`\`\`${error.message}\`\`\`` 
                });
            }
        }

        if (subcommand === 'util') {
            const utilName = interaction.options.getString('nombre');
            const utilPath = path.join(__dirname, `../utils/${utilName}.js`);

            if (!fs.existsSync(utilPath)) {
                return interaction.editReply({ 
                    content: `❌ No existe el archivo de utilidad \`${utilName}\` en la carpeta utils` 
                });
            }

            delete require.cache[require.resolve(utilPath)];

            try {
                require(utilPath);
                const elapsed = Date.now() - startTime;
                
                const embed = new EmbedBuilder()
                    .setTitle('> Utilidad Recargada')
                    .setDescription(`**Archivo:** \`${utilName}.js\`\n**Tiempo:** ${elapsed}ms`)
                    .setColor(config.embedColor)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ 
                    content: `❌ Error al recargar \`${utilName}\`:\n\`\`\`${error.message}\`\`\`` 
                });
            }
        }

        if (subcommand === 'data') {
            const dataName = interaction.options.getString('nombre');
            const dataPath = path.join(__dirname, `../data/${dataName}.js`);

            if (!fs.existsSync(dataPath)) {
                return interaction.editReply({ 
                    content: `❌ No existe el archivo de datos \`${dataName}\` en la carpeta data` 
                });
            }

            delete require.cache[require.resolve(dataPath)];

            try {
                require(dataPath);
                const elapsed = Date.now() - startTime;
                
                const embed = new EmbedBuilder()
                    .setTitle('✅ Archivo de Datos Recargado')
                    .setDescription(`**Archivo:** \`${dataName}.js\`\n**Tiempo:** ${elapsed}ms`)
                    .setColor('#00FF00')
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ 
                    content: `❌ Error al recargar \`${dataName}\`:\n\`\`\`${error.message}\`\`\`` 
                });
            }
        }

        if (subcommand === 'everything') {
            let totalReloaded = 0;
            let totalErrors = [];

            const commandsPath = path.join(__dirname, '.');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)];
                try {
                    const command = require(filePath);
                    if ('data' in command && 'execute' in command) {
                        interaction.client.commands.set(command.data.name, command);
                        totalReloaded++;
                    }
                } catch (error) {
                    totalErrors.push(`CMD ${file}: ${error.message}`);
                }
            }

            const eventsPath = path.join(__dirname, '../events');
            if (fs.existsSync(eventsPath)) {
                const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
                for (const file of eventFiles) {
                    const filePath = path.join(eventsPath, file);
                    delete require.cache[require.resolve(filePath)];
                    try {
                        const event = require(filePath);
                        if (event.name && event.execute) {
                            interaction.client.removeAllListeners(event.name);
                            if (event.once) {
                                interaction.client.once(event.name, (...args) => event.execute(...args, interaction.client));
                            } else {
                                interaction.client.on(event.name, (...args) => event.execute(...args, interaction.client));
                            }
                            totalReloaded++;
                        }
                    } catch (error) {
                        totalErrors.push(`EVENT ${file}: ${error.message}`);
                    }
                }
            }

            const utilsPath = path.join(__dirname, '../utils');
            if (fs.existsSync(utilsPath)) {
                const utilFiles = fs.readdirSync(utilsPath).filter(file => file.endsWith('.js'));
                for (const file of utilFiles) {
                    const filePath = path.join(utilsPath, file);
                    delete require.cache[require.resolve(filePath)];
                    try {
                        require(filePath);
                        totalReloaded++;
                    } catch (error) {
                        totalErrors.push(`UTIL ${file}: ${error.message}`);
                    }
                }
            }

            const dataPath = path.join(__dirname, '../data');
            if (fs.existsSync(dataPath)) {
                const dataFiles = fs.readdirSync(dataPath).filter(file => file.endsWith('.js'));
                for (const file of dataFiles) {
                    const filePath = path.join(dataPath, file);
                    delete require.cache[require.resolve(filePath)];
                    try {
                        require(filePath);
                        totalReloaded++;
                    } catch (error) {
                        totalErrors.push(`DATA ${file}: ${error.message}`);
                    }
                }
            }

            const elapsed = Date.now() - startTime;
            const embed = new EmbedBuilder()
                .setTitle(totalErrors.length > 0 ? '⚠️ Recarga Completa con Errores' : '🔥 Recarga Completa Exitosa')
                .setDescription(
                    `**Total Recargado:** ${totalReloaded} archivos\n` +
                    `**Errores:** ${totalErrors.length}\n` +
                    `**Tiempo:** ${elapsed}ms` +
                    (totalErrors.length > 0 ? `\n\n**Errores:**\n\`\`\`${totalErrors.join('\n').substring(0, 1500)}\`\`\`` : '')
                )
                .setColor(totalErrors.length > 0 ? '#FFA500' : '#00FF00')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    },
};