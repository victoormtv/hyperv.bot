const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { channels, roles } = require('../data/ids');
const config = require('../data/config');
const { 
    convertToSoles, 
    calcularMontoNeto
} = require('../data/commissionRules');

const salesFilePath = path.join(__dirname, '../data/sales.json');

function loadSales() {
    if (!fs.existsSync(salesFilePath)) {
        fs.writeFileSync(salesFilePath, JSON.stringify([], null, 2));
        return [];
    }
    const data = fs.readFileSync(salesFilePath, 'utf-8');
    return JSON.parse(data);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('propina')
        .setDescription('Registrar una propina recibida')
        .addNumberOption(option =>
            option.setName('monto')
                .setDescription('Monto de la propina')
                .setRequired(true)
                .setMinValue(0))
        .addStringOption(option =>
            option.setName('moneda')
                .setDescription('Moneda del pago')
                .setRequired(true)
                .addChoices(
                    { name: 'Soles (PEN)', value: 'PEN' },
                    { name: 'Dólares (USD)', value: 'USD' },
                    { name: 'Pesos Argentinos (ARS)', value: 'ARS' },
                    { name: 'Pesos Colombianos (COP)', value: 'COP' },
                    { name: 'Pesos Mexicanos (MXN)', value: 'MXN' },
                    { name: 'Pesos Chilenos (CLP)', value: 'CLP' },
                    { name: 'Pesos Dominicanos (DOP)', value: 'DOP' },
                    { name: 'Pesos Uruguayos (UYU)', value: 'UYU' },
                    { name: 'Bolivianos (BOB)', value: 'BOB' },
                    { name: 'Quetzales (GTQ)', value: 'GTQ' },
                    { name: 'Euros (EUR)', value: 'EUR' }
                ))
        .addStringOption(option =>
            option.setName('metodopago')
                .setDescription('Método de pago utilizado')
                .setRequired(true)
                .addChoices(
                    { name: 'Yape/Plin', value: 'Yape/Plin' },
                    { name: 'BCP Soles', value: 'BCP Soles' },
                    { name: 'Interbank Soles', value: 'Interbank Soles' },
                    { name: 'Interbank Dolares', value: 'Interbank Dolares' },
                    { name: 'Scotiabank Soles', value: 'Scotiabank Soles' },
                    { name: 'BBVA Soles', value: 'BBVA Soles' },
                    { name: 'Western Union', value: 'Western Union' },
                    { name: 'Remitly', value: 'Remitly' },
                    { name: 'PayPal', value: 'PayPal' },
                    { name: 'CashApp', value: 'CashApp' },
                    { name: 'Binance', value: 'Binance' },
                    { name: 'Zelle', value: 'Zelle' },
                    { name: 'Banco Estado', value: 'Banco Estado' },
                    { name: 'Nequi', value: 'Nequi' },
                    { name: 'Prex', value: 'Prex' },
                    { name: 'Bizum', value: 'Bizum' },
                    { name: 'BanRural', value: 'BanRural' },
                    { name: 'BCP Bolivia', value: 'BCP Bolivia' },
                    { name: 'Spin Oxxo', value: 'Spin Oxxo' },
                    { name: 'Clabe Nubank', value: 'Clabe Nubank' },
                    { name: 'CBU Mercado Pago', value: 'CBU Mercado Pago' },
                    { name: 'Banco Pichincha', value: 'Banco Pichincha' },
                    { name: 'BanReserva', value: 'BanReserva' },
                    { name: 'Otro', value: 'otro' }
                ))
        .addAttachmentOption(option =>
            option.setName('comprobante')
                .setDescription('Captura de pantalla del comprobante de pago')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nota')
                .setDescription('Nota adicional (opcional)')
                .setRequired(false)),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('> HyperV - Propina')
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        if (interaction.channelId !== channels.LOGIN_VENTAS) {
            embed.setDescription('⚠️ Este comando solo puede usarse en el canal de ventas.');
            return await interaction.reply({ 
                embeds: [embed], 
                ephemeral: true 
            });
        }

        const isAdmin = roles.ADMIN.some(roleId => interaction.member.roles.cache.has(roleId));
        const isVendor = interaction.member.roles.cache.has(roles.VENDOR);
        const isSupport = interaction.member.roles.cache.has(roles.SUPPORT);

        if (!isAdmin && !isVendor && !isSupport) {
            embed.setDescription('⚠️ No tienes permisos para usar este comando. Solo staff autorizado puede registrar propinas.');
            return await interaction.reply({ 
                embeds: [embed], 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        const monto = interaction.options.getNumber('monto');
        const monedaPago = interaction.options.getString('moneda');
        const metodoPago = interaction.options.getString('metodopago');
        const comprobante = interaction.options.getAttachment('comprobante');
        const nota = interaction.options.getString('nota') || '';

        if (!comprobante.contentType || !comprobante.contentType.startsWith('image/')) {
            embed.setDescription('⚠️ El comprobante debe ser una imagen válida (PNG, JPG, JPEG, etc.)');
            return await interaction.editReply({ 
                embeds: [embed]
            });
        }

        const detallesPago = calcularMontoNeto(monto, metodoPago, monedaPago);
        const montoNetoSoles = convertToSoles(detallesPago.montoNeto, monedaPago);
        const comisionMetodoPagoSoles = convertToSoles(detallesPago.comisionTotal, monedaPago);

        const sales = loadSales();
        const numeroVenta = sales.length + 1;

        const propinaData = {
            numeroVenta: numeroVenta,
            tipoVenta: 'propina',
            vendedor: interaction.user.tag,
            vendedorId: interaction.user.id,
            canal: interaction.channel.name,
            canalId: interaction.channelId,
            whatsapp: 'N/A',
            metodoPago,
            producto: 'Propina',
            periodo: 'N/A',
            
            precioEstandar: 0,
            montoBrutoCliente: detallesPago.montoBruto,
            comisionMetodoPago: detallesPago.comisionTotal,
            montoNetoRecibido: detallesPago.montoNeto,
            monedaOriginal: monedaPago,
            
            precioRealSoles: montoNetoSoles,
            comisionMetodoPagoSoles: comisionMetodoPagoSoles,
            
            descuento: 0,
            propina: 0,
            tipoAjuste: 'ninguno',
            diferenciaPorcentaje: 0,
            comisionFija: 0,
            nota: nota,
            
            comisionVentaBase: 0,
            comisionSoporteBase: 0,
            comisionVenta: 0,
            comisionSoporte: 0,
            monedaComision: 'Soles',
            
            requiereSoporte: false,
            vendedorSoporte: 'No requerido',
            vendedorSoporteId: null,
            imagen: comprobante.url,
            licencia: 'N/A',
            fecha: new Date().toISOString()
        };

        const embedPropina = new EmbedBuilder()
            .setTitle(`> HyperV - PROPINA #${numeroVenta.toString().padStart(3, '0')}`)
            .setDescription(`**Registrado por:** <@${interaction.user.id}>`)
            .addFields(
                { name: 'Monto', value: `${monto.toFixed(2)} ${monedaPago}`, inline: true },
                { name: 'Método de Pago', value: metodoPago, inline: true },
                { name: 'Neto en Soles', value: `S/ ${montoNetoSoles.toFixed(2)}`, inline: true }
            );

        if (detallesPago.comisionTotal > 0) {
            embedPropina.addFields({
                name: 'Descuento del Método',
                value: `${detallesPago.comisionTotal.toFixed(2)} ${monedaPago} (S/ ${comisionMetodoPagoSoles.toFixed(2)})`,
                inline: false
            });
        }

        if (nota) {
            embedPropina.addFields({ name: 'Nota', value: nota, inline: false });
        }

        embedPropina.setImage(comprobante.url)
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        const adminMentions = `<@&${roles.ADMIN[0]}>`;

        const reply = await interaction.editReply({
            content: adminMentions,
            embeds: [embedPropina],
            fetchReply: true
        });

        propinaData.messageId = reply.id;
        sales.push(propinaData);
        fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));

        console.log(`Propina #${numeroVenta} registrada: ${monto} ${monedaPago} (${montoNetoSoles.toFixed(2)} Soles netos) por ${interaction.user.tag}`);
    }
};