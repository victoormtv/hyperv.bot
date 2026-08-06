const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { roles } = require('../data/ids');
const config = require('../data/config');

const salesFilePath = path.join(__dirname, '../data/sales.json');

function loadSales() {
    if (!fs.existsSync(salesFilePath)) {
        return [];
    }
    const data = fs.readFileSync(salesFilePath, 'utf-8');
    return JSON.parse(data);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reparar-venta')
        .setDescription('Reparar y actualizar todos los datos de una venta (Solo Admins)')
        .addIntegerOption(option =>
            option.setName('numero_venta')
                .setDescription('Número de la venta a reparar')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('soporte')
                .setDescription('Usuario de soporte a asignar (opcional)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('whatsapp')
                .setDescription('Nuevo número de WhatsApp (opcional)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('metodo_pago')
                .setDescription('Nuevo método de pago (opcional)')
                .setRequired(false)
                .addChoices(
                    { name: 'Yape/Plin', value: 'Yape/Plin' },
                    { name: 'BCP Soles', value: 'BCP Soles' },
                    { name: 'Interbank Soles', value: 'Interbank Soles' },
                    { name: 'Interbank Dólares', value: 'Interbank Dolares' },
                    { name: 'Scotiabank Soles', value: 'Scotiabank Soles' },
                    { name: 'BBVA Soles', value: 'BBVA Soles' },
                    { name: 'Western Union', value: 'Western Union' },
                    { name: 'Remitly', value: 'Remitly' },
                    { name: 'PayPal', value: 'PayPal' },
                    { name: 'Binance', value: 'Binance' },
                    { name: 'Zelle', value: 'Zelle' },
                    { name: 'CashApp', value: 'CashApp' },
                    { name: 'Banco Estado', value: 'Banco Estado' },
                    { name: 'Nequi', value: 'Nequi' },
                    { name: 'Prex', value: 'Prex' },
                    { name: 'Bizum', value: 'Bizum' },
                    { name: 'BanRural', value: 'BanRural' },
                    { name: 'Yasta Bolivia', value: 'Yasta Bolivia' },
                    { name: 'Spin Oxxo', value: 'Spin Oxxo' },
                    { name: 'Clabe Nubank', value: 'Clabe Nubank' },
                    { name: 'CBU Mercado Pago', value: 'CBU Mercado Pago' },
                    { name: 'Banco Pichincha', value: 'Banco Pichincha' },
                    { name: 'BanReserva', value: 'BanReserva' },
                    { name: 'Otro', value: 'otro' }
                ))
        .addStringOption(option =>
            option.setName('moneda')
                .setDescription('Nueva moneda (opcional)')
                .setRequired(false)
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
        .addNumberOption(option =>
            option.setName('precio_estandar')
                .setDescription('Nuevo precio estándar en PEN (opcional)')
                .setRequired(false)
                .setMinValue(0))
        .addNumberOption(option =>
            option.setName('comision_venta')
                .setDescription('Nueva comisión de venta en PEN (opcional)')
                .setRequired(false)
                .setMinValue(0))
        .addNumberOption(option =>
            option.setName('comision_soporte')
                .setDescription('Nueva comisión de soporte en PEN (opcional)')
                .setRequired(false)
                .setMinValue(0))
        .addStringOption(option =>
            option.setName('nota')
                .setDescription('Nueva nota (opcional)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(roles.ADMIN[0]) && !interaction.member.roles.cache.has(roles.ADMIN[1])) {
            return await interaction.reply({
                content: '❌ Solo los administradores pueden usar este comando.',
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        const numeroVenta = interaction.options.getInteger('numero_venta');
        const usuarioSoporte = interaction.options.getUser('soporte');
        const nuevoWhatsapp = interaction.options.getString('whatsapp');
        const nuevoMetodoPago = interaction.options.getString('metodo_pago');
        const nuevaMoneda = interaction.options.getString('moneda');
        const nuevoPrecioEstandar = interaction.options.getNumber('precio_estandar');
        const nuevaComisionVenta = interaction.options.getNumber('comision_venta');
        const nuevaComisionSoporte = interaction.options.getNumber('comision_soporte');
        const nuevaNota = interaction.options.getString('nota');

        const sales = loadSales();
        const ventaIndex = sales.findIndex(v => v.numeroVenta === numeroVenta);

        if (ventaIndex === -1) {
            return await interaction.editReply({
                content: `❌ No se encontró la venta #${numeroVenta}.`
            });
        }

        const venta = sales[ventaIndex];
        const cambiosRealizados = [];

        if (usuarioSoporte) {
            if (!venta.requiereSoporte) {
                return await interaction.editReply({
                    content: `⚠️ La venta #${numeroVenta} no requiere soporte. No se puede asignar.`
                });
            }
            sales[ventaIndex].vendedorSoporte = usuarioSoporte.tag;
            sales[ventaIndex].vendedorSoporteId = usuarioSoporte.id;
            sales[ventaIndex].fechaAsignacionSoporte = new Date().toISOString();
            cambiosRealizados.push(`**Soporte:** ${venta.vendedorSoporte || 'N/A'} → <@${usuarioSoporte.id}>`);
        }

        if (nuevoWhatsapp) {
            cambiosRealizados.push(`**WhatsApp:** ${venta.whatsapp} → ${nuevoWhatsapp}`);
            sales[ventaIndex].whatsapp = nuevoWhatsapp;
        }

        if (nuevoMetodoPago) {
            cambiosRealizados.push(`**Método de pago:** ${venta.metodoPago} → ${nuevoMetodoPago}`);
            sales[ventaIndex].metodoPago = nuevoMetodoPago;
        }

        if (nuevaMoneda) {
            cambiosRealizados.push(`**Moneda:** ${venta.monedaOriginal} → ${nuevaMoneda}`);
            sales[ventaIndex].monedaOriginal = nuevaMoneda;
        }

        if (nuevoPrecioEstandar !== null && nuevoPrecioEstandar !== undefined) {
            cambiosRealizados.push(`**Precio estándar:** ${venta.precioEstandar} PEN → ${nuevoPrecioEstandar} PEN`);
            sales[ventaIndex].precioEstandar = nuevoPrecioEstandar;
        }

        if (nuevaComisionVenta !== null && nuevaComisionVenta !== undefined) {
            cambiosRealizados.push(`**Comisión venta:** ${venta.comisionVenta} PEN → ${nuevaComisionVenta} PEN`);
            sales[ventaIndex].comisionVenta = nuevaComisionVenta;
        }

        if (nuevaComisionSoporte !== null && nuevaComisionSoporte !== undefined) {
            cambiosRealizados.push(`**Comisión soporte:** ${venta.comisionSoporte} PEN → ${nuevaComisionSoporte} PEN`);
            sales[ventaIndex].comisionSoporte = nuevaComisionSoporte;
        }

        if (nuevaNota !== null) {
            cambiosRealizados.push(`**Nota:** ${venta.nota || '(vacío)'} → ${nuevaNota || '(vacío)'}`);
            sales[ventaIndex].nota = nuevaNota;
        }

        if (cambiosRealizados.length === 0) {
            return await interaction.editReply({
                content: '⚠️ No se especificó ningún cambio. Usa al menos una opción para reparar la venta.'
            });
        }

        sales[ventaIndex].reparadaManualmente = true;
        sales[ventaIndex].fechaReparacion = new Date().toISOString();
        sales[ventaIndex].reparadaPor = interaction.user.tag;

        fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));

        let mensajeDiscord = '';
        
        try {
            const channel = await interaction.client.channels.fetch(venta.canalId);
            const message = await channel.messages.fetch(venta.messageId);
            const embed = message.embeds[0];
            const ventaActualizada = sales[ventaIndex];

            const updatedEmbed = EmbedBuilder.from(embed);

            const fieldsToUpdate = [];

            if (nuevoWhatsapp) {
                const whatsappIndex = embed.fields.findIndex(f => f.name === 'WhatsApp');
                if (whatsappIndex !== -1) {
                    fieldsToUpdate.push({ index: whatsappIndex, name: 'WhatsApp', value: nuevoWhatsapp, inline: true });
                }
            }

            if (usuarioSoporte) {
                const soporteIndex = embed.fields.findIndex(f => f.name === 'Soporte' || f.name.toLowerCase().includes('soport'));
                if (soporteIndex !== -1) {
                    fieldsToUpdate.push({ index: soporteIndex, name: 'Soporte', value: `<@${usuarioSoporte.id}> ⚙️`, inline: true });
                }
            }

            if (nuevoMetodoPago) {
                const metodoIndex = embed.fields.findIndex(f => f.name === 'Método de Pago');
                if (metodoIndex !== -1) {
                    fieldsToUpdate.push({ index: metodoIndex, name: 'Método de Pago', value: nuevoMetodoPago, inline: true });
                }
            }

            if (nuevaMoneda) {
                const montoIndex = embed.fields.findIndex(f => f.name === 'Monto');
                if (montoIndex !== -1) {
                    const montoActual = embed.fields[montoIndex].value.split(' ')[0]; // Extrae el número
                    fieldsToUpdate.push({ index: montoIndex, name: 'Monto', value: `${montoActual} ${nuevaMoneda}`, inline: true });
                }
            }

            fieldsToUpdate.forEach(field => {
                updatedEmbed.spliceFields(field.index, 1, { 
                    name: field.name, 
                    value: field.value, 
                    inline: field.inline 
                });
            });

            if (nuevaNota !== null) {
                const notaIndex = embed.fields.findIndex(f => f.name === 'Nota');
                if (notaIndex !== -1) {
                    if (nuevaNota) {
                        updatedEmbed.spliceFields(notaIndex, 1, { name: 'Nota', value: nuevaNota, inline: false });
                    } else {
                        updatedEmbed.spliceFields(notaIndex, 1);
                    }
                } else if (nuevaNota) {
                    updatedEmbed.addFields({ name: 'Nota', value: nuevaNota, inline: false });
                }
            }

            await message.edit({ embeds: [updatedEmbed] });
            mensajeDiscord = '✅ Actualizado';

        } catch (error) {
            console.error('Error al actualizar mensaje:', error);
            mensajeDiscord = `❌ No se pudo actualizar\n**Razón:** ${error.message}`;
        }

        const resumenEmbed = new EmbedBuilder()
            .setTitle(`⚙️ Venta #${numeroVenta} Reparada`)
            .setDescription(
                `**Cambios realizados:**\n${cambiosRealizados.join('\n')}\n\n` +
                `**Estado de actualización:**\n` +
                `📄 Archivo JSON: ✅ Actualizado\n` +
                `💬 Mensaje Discord: ${mensajeDiscord}`
            )
            .setColor(config.embedColor)
            .setFooter({ text: `Reparado por ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.editReply({
            embeds: [resumenEmbed]
        });

        console.log(`⚙️ Venta #${numeroVenta} reparada por ${interaction.user.tag}`);
        console.log(`   Cambios: ${cambiosRealizados.length} campos actualizados`);
    }
};