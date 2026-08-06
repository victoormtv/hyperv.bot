const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { roles, categories } = require('../data/ids');
const config = require('../data/config');
const paymentMethods = require('../data/paymentMethods');

function isInTicket(interaction) {
    return interaction.channel.parentId === categories.TICKETS;
}

function isVendor(interaction) {
    const userRoles = interaction.member.roles.cache;
    return roles.ADMIN.some(adminId => userRoles.has(adminId)) || 
           userRoles.has(roles.VENDOR) || 
           userRoles.has(roles.SUPPORT);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('datos')
        .setDescription('Obtiene datos bancarios de métodos de pago (Solo vendedores)')
        .addSubcommand(subcommand =>
            subcommand
                .setName('peru-yape')
                .setDescription('Yape Perú'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('peru-plin')
                .setDescription('Plin Perú'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('peru-bcp')
                .setDescription('BCP Perú'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('peru-interbank')
                .setDescription('Interbank Soles'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('peru-interbankdolares')
                .setDescription('Interbank Dólares'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('peru-bbva')
                .setDescription('BBVA Perú'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('peru-scotiabank')
                .setDescription('Scotiabank Perú'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('eeuu-paypal')
                .setDescription('PayPal'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('eeuu-zelle')
                .setDescription('Zelle'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('eeuu-binance')
                .setDescription('Binance'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('eeuu-cashapp')
                .setDescription('CashApp'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('colombia-nequi')
                .setDescription('Nequi Colombia'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('chile-bancoestado')
                .setDescription('Banco Estado Chile'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('mexico-nubank')
                .setDescription('NUBANK México'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('mexico-spinoxxo')
                .setDescription('Spin Oxxo México'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('argentina-cbu')
                .setDescription('CBU Argentina'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('guatemala-banrural')
                .setDescription('Banrural Guatemala'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ecuador-pichincha')
                .setDescription('Banco Pichincha Ecuador'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('republicadominicana-banreserva')
                .setDescription('BanReserva Rep. Dominicana'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bolivia-bcp')
                .setDescription('Yasta Bolivia'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('uruguay-prex')
                .setDescription('Prex Uruguay')),

    async execute(interaction) {
        if (!isInTicket(interaction)) {
            return await interaction.reply({
                content: 'Este comando solo puede usarse dentro de un ticket.',
                ephemeral: true
            });
        }

        if (!isVendor(interaction)) {
            return await interaction.reply({
                content: 'Solo los vendedores pueden ejecutar este comando.',
                ephemeral: true
            });
        }

        const subcommand = interaction.options.getSubcommand();
        
        // Mapeo de subcomandos a keys en paymentMethods.private
        const methodMapping = {
            'peru-yape': 'yape',
            'peru-plin': 'plin',
            'peru-bcp': 'bcp',
            'peru-interbank': 'interbank',
            'peru-interbankdolares': 'interbankdolares',
            'peru-bbva': 'bbva',
            'peru-scotiabank': 'scotiabank',
            'eeuu-paypal': 'paypal',
            'eeuu-zelle': 'zelle',
            'eeuu-binance': 'binance',
            'eeuu-cashapp': 'cashapp',
            'colombia-nequi': 'nequi',
            'chile-bancoestado': 'bancoestado',
            'mexico-nubank': 'nubank',
            'mexico-spinoxxo': 'spinoxxo',
            'argentina-cbu': 'cbu',
            'guatemala-banrural': 'banrural',
            'ecuador-pichincha': 'pichincha',
            'republicadominicana-banreserva': 'banreserva',
            'bolivia-sol': 'bancosol',
            'uruguay-prex': 'prex'
        };

        const methodKey = methodMapping[subcommand];
        const methodData = paymentMethods.private[methodKey];
        
        if (!methodData) {
            return await interaction.reply({
                content: `Método de pago no encontrado: ${subcommand}`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(methodData.title)
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        if (methodData.thumbnail) {
            embed.setThumbnail(methodData.thumbnail);
        }

        if (methodData.phone) {
            embed.addFields({ name: 'Teléfono', value: `\`${methodData.phone}\``, inline: true });
        }
        
        if (methodData.email) {
            embed.addFields({ name: 'Correo', value: `\`${methodData.email}\``, inline: true });
        }
        
        if (methodData.holder) {
            embed.addFields({ name: 'Titular', value: `\`${methodData.holder}\``, inline: true });
        }
        
        if (methodData.accountNumber) {
            embed.addFields({ name: 'Número de Cuenta', value: `\`${methodData.accountNumber}\``, inline: false });
        }
        
        if (methodData.cci) {
            embed.addFields({ name: 'CCI', value: `\`${methodData.cci}\``, inline: false });
        }

        if (methodData.clabe) {
            embed.addFields({ name: 'Clabe', value: `\`${methodData.clabe}\``, inline: false });
        }

        if (methodData.cbu) {
            embed.addFields({ name: 'CBU', value: `\`${methodData.cbu}\``, inline: false });
        }

        if (methodData.cardNumber) {
            embed.addFields({ name: 'Número de Tarjeta', value: `\`${methodData.cardNumber}\``, inline: false });
        }
        
        if (methodData.accountType) {
            embed.addFields({ name: 'Tipo de Cuenta', value: methodData.accountType, inline: true });
        }
        
        if (methodData.bank) {
            embed.addFields({ name: 'Banco', value: methodData.bank, inline: true });
        }
        
        if (methodData.userId) {
            embed.addFields({ name: 'User ID', value: `\`${methodData.userId}\``, inline: true });
        }

        if (methodData.link) {
            embed.addFields({ name: 'Link', value: methodData.link, inline: false });
        }
        
        if (methodData.instructions) {
            embed.addFields({ name: 'Instrucciones', value: methodData.instructions, inline: false });
        }

        if (methodData.qrCode) {
            embed.setImage(methodData.qrCode);
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
};
