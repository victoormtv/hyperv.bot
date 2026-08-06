const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { categories } = require('../data/ids');
const config = require('../data/config');
const paymentMethods = require('../data/paymentMethods');

function isInTicket(interaction) {
    return interaction.channel.parentId === categories.TICKETS;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('metodos')
        .setDescription('Consulta métodos de pago disponibles por país')
        .addSubcommand(subcommand =>
            subcommand
                .setName('peru')
                .setDescription('Métodos de pago de Perú'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('eeuu-internacional')
                .setDescription('Métodos de pago internacionales'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('colombia')
                .setDescription('Métodos de pago de Colombia'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('chile')
                .setDescription('Métodos de pago de Chile'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('mexico')
                .setDescription('Métodos de pago de México'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('argentina')
                .setDescription('Métodos de pago de Argentina'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('guatemala')
                .setDescription('Métodos de pago de Guatemala'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ecuador')
                .setDescription('Métodos de pago de Ecuador'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('republicadominicana')
                .setDescription('Métodos de pago de República Dominicana'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bolivia')
                .setDescription('Métodos de pago de Bolivia'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('uruguay')
                .setDescription('Métodos de pago de Uruguay')),

    async execute(interaction) {
        if (!isInTicket(interaction)) {
            return await interaction.reply({
                content: 'Este comando solo puede usarse dentro de un ticket.',
                ephemeral: true
            });
        }

        const subcommand = interaction.options.getSubcommand();

        const countryMapping = {
            'peru': 'peru',
            'eeuu-internacional': 'internacional',
            'colombia': 'colombia',
            'chile': 'chile',
            'mexico': 'mexico',
            'argentina': 'argentina',
            'guatemala': 'guatemala',
            'ecuador': 'ecuador',
            'republicadominicana': 'republicadominicana',
            'bolivia': 'boliviapublic',
            'uruguay': 'uruguay'
        };

        const countryKey = countryMapping[subcommand];
        const methodData = paymentMethods[countryKey];
        
        if (!methodData) {
            return await interaction.reply({
                content: `No se encontró información para: ${subcommand}`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(methodData.title)
            .setDescription(methodData.description)
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        let methodsList = '';
        methodData.methods.forEach(method => {
            const emoji = method.emoji || '';
            methodsList += `${emoji} ${method.name}\n`;
        });

        embed.addFields({ 
            name: 'Métodos Disponibles', 
            value: methodsList || 'No hay métodos disponibles' 
        });

        if (methodData.image) {
            embed.setImage(methodData.image);
        }

        return await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
};
