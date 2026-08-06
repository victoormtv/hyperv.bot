const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { channels, roles } = require('../data/ids');
const config = require('../data/config');
const { getCommission, calcularUpgrade } = require('../data/commissionRules');

const salesFilePath = path.join(__dirname, '../data/sales.json');
const liston = '<:linea:1432870878382653530>'.repeat(22);

function loadSales() {
    if (!fs.existsSync(salesFilePath)) {
        fs.writeFileSync(salesFilePath, JSON.stringify([], null, 2));
        return [];
    }
    const data = fs.readFileSync(salesFilePath, 'utf-8');
    return JSON.parse(data);
}

function saveSales(sales) {
    fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upgrade')
        .setDescription('Registrar un upgrade de plan de un cliente')
        .addIntegerOption(option =>
            option.setName('venta_original')
                .setDescription('Número de la venta original a upgradear')
                .setRequired(true)
                .setMinValue(1)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('producto_nuevo')
                .setDescription('Nuevo producto')
                .setRequired(true)
                .addChoices(
                    { name: 'Panel Full', value: 'Panel Full' },
                    { name: 'Panel Secure', value: 'Panel Secure' },
                    { name: 'Panel Only Aimbot', value: 'Panel Only Aimbot' },
                    { name: 'Bypass APK', value: 'Bypass APK' },
                    { name: 'Bypass ID', value: 'Bypass ID' },
                    { name: 'Menu Chams', value: 'Menu Chams' },
                    { name: 'Panel iOS', value: 'Panel iOS' },
                    { name: 'Aimbot Body iOS', value: 'Aimbot Body iOS' },
                    { name: 'Panel Android', value: 'Panel Android' },
                    { name: 'Regedit', value: 'Regedit' },
                    { name: 'Aimlock', value: 'Aimlock' },
                    { name: 'Aimbot Color', value: 'Aimbot Color' },
                    { name: 'Spoofer', value: 'Spoofer' },
                    { name: 'Panel Warzone', value: 'Panel Warzone' },
                    { name: 'Discord Tools', value: 'Discord Tools' }
                ))
        .addStringOption(option =>
            option.setName('periodo_nuevo')
                .setDescription('Nuevo período')
                .setRequired(true)
                .addChoices(
                    { name: '1 dia', value: '1 dia' },
                    { name: 'Semanal', value: 'Semanal' },
                    { name: '14 dias', value: '14 dias' },
                    { name: '15 dias', value: '15 dias' },
                    { name: 'Mensual', value: 'Mensual' },
                    { name: '60 dias', value: '60 dias' },
                    { name: 'Trimestral', value: 'Trimestral' },
                    { name: 'Anual', value: 'Anual' },
                    { name: 'Por Temporada', value: 'Por Temporada' },
                    { name: 'Permanente', value: 'Permanente' }
                ))
        .addNumberOption(option =>
            option.setName('precio_cobrado')
                .setDescription('Monto cobrado por el upgrade')
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
                    { name: 'Yasta Bolivia', value: 'Yasta Bolivia' },
                    { name: 'Spin Oxxo', value: 'Spin Oxxo' },
                    { name: 'Clabe Nubank', value: 'Clabe Nubank' },
                    { name: 'CBU Mercado Pago', value: 'CBU Mercado Pago' },
                    { name: 'Banco Guayaquil', value: 'Banco Guayaquil' },
                    { name: 'BanReserva', value: 'BanReserva' },
                    { name: 'Otro', value: 'otro' }
                ))
        .addAttachmentOption(option =>
            option.setName('comprobante')
                .setDescription('Imagen del comprobante de pago')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('requiere_soporte')
                .setDescription('¿Este upgrade requiere soporte? (Default: Sí)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('nota')
                .setDescription('Nota adicional (opcional)')
                .setRequired(false)),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);

        if (focusedOption.name === 'venta_original') {
            const sales = loadSales();
            const input = focusedOption.value.toString().toLowerCase();
            
            const ventasValidas = sales.filter(v => 
                (v.tipoVenta === 'normal' || 
                v.tipoVenta === 'discord' || 
                v.tipoVenta === 'ads' || 
                !v.tipoVenta) &&
                v.producto &&
                v.periodo
            );

            let choices = [];

            if (input === '') {
                choices = ventasValidas.slice(-25).reverse();
            } else if (!isNaN(input)) {
                const numeroVenta = parseInt(input);
                choices = ventasValidas.filter(v => 
                    v.numeroVenta === numeroVenta || 
                    v.numeroVenta.toString().includes(input)
                );
                
                if (choices.length === 0) {
                    choices = ventasValidas.filter(v => 
                        v.numeroVenta.toString().startsWith(input)
                    ).slice(0, 25);
                }
            } else {
                choices = ventasValidas.filter(v => 
                    (v.whatsapp && v.whatsapp.toLowerCase().includes(input)) ||
                    (v.producto && v.producto.toLowerCase().includes(input)) ||
                    (v.vendedor && v.vendedor.toLowerCase().includes(input))
                ).slice(0, 25);
            }

            choices = choices.sort((a, b) => b.numeroVenta - a.numeroVenta);

            const opciones = choices.map(venta => {
                const whatsapp = venta.whatsapp && venta.whatsapp !== '-' ? venta.whatsapp : 'N/A';
                const label = `#${venta.numeroVenta} - ${venta.producto} ${venta.periodo} (${whatsapp})`;
                return {
                    name: label.substring(0, 100),
                    value: venta.numeroVenta
                };
            });

            if (opciones.length === 0) {
                await interaction.respond([{
                    name: `No se encontraron ventas con "${input}"`,
                    value: 0
                }]);
            } else {
                await interaction.respond(opciones);
            }
        }
    },

    async execute(interaction) {
        const validChannels = [channels.LOGIN_VENTAS];

        if (!validChannels.includes(interaction.channelId)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription('Este comando solo puede usarse en el canal de ventas.')
                .setColor('#FF0000');

            return await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const ventaOriginalId = interaction.options.getInteger('venta_original');
        const productoNuevo = interaction.options.getString('producto_nuevo');
        const periodoNuevo = interaction.options.getString('periodo_nuevo');
        const precioCobrado = interaction.options.getNumber('precio_cobrado');
        const moneda = interaction.options.getString('moneda');
        const metodoPago = interaction.options.getString('metodopago');
        const comprobante = interaction.options.getAttachment('comprobante');
        const nota = interaction.options.getString('nota') || '';
        const requiereSoporte = interaction.options.getBoolean('requiere_soporte') ?? true;

        const sales = loadSales();
        const ventaOriginal = sales.find(v => v.numeroVenta === ventaOriginalId);

        if (!ventaOriginal) {
            const notFoundEmbed = new EmbedBuilder()
                .setDescription(`No se encontró la venta #${ventaOriginalId}.`)
                .setColor('#FF0000');

            return await interaction.editReply({
                embeds: [notFoundEmbed]
            });
        }

        if (ventaOriginal.tipoVenta === 'upgrade') {
            const alreadyUpgradeEmbed = new EmbedBuilder()
                .setDescription(`La venta #${ventaOriginalId} ya es un upgrade. No se pueden hacer upgrades de upgrades.`)
                .setColor('#FF0000');

            return await interaction.editReply({
                embeds: [alreadyUpgradeEmbed]
            });
        }

        const productoOriginal = ventaOriginal.producto.split(' + ')[0];
        const periodoOriginal = ventaOriginal.periodo.split(' + ')[0];

        const comisionesOriginales = getCommission(productoOriginal, periodoOriginal);
        const comisionesNuevas = getCommission(productoNuevo, periodoNuevo);

        if (comisionesOriginales.precioEstandar === 0) {
            const noPriceOriginalEmbed = new EmbedBuilder()
                .setDescription(`No se encontró precio estándar para el plan original: **${productoOriginal} ${periodoOriginal}**`)
                .setColor('#FF0000');

            return await interaction.editReply({
                embeds: [noPriceOriginalEmbed]
            });
        }

        if (comisionesNuevas.precioEstandar === 0) {
            const noPriceNewEmbed = new EmbedBuilder()
                .setDescription(`No se encontró precio estándar para el plan nuevo: **${productoNuevo} ${periodoNuevo}**`)
                .setColor('#FF0000');

            return await interaction.editReply({
                embeds: [noPriceNewEmbed]
            });
        }

        const diferenciaComisionVenta = comisionesNuevas.venta - comisionesOriginales.venta;
        const comisionUpgrade = diferenciaComisionVenta * 0.30;
        const comisionSoporte = requiereSoporte ? comisionesNuevas.soporte : 0;

        const resultadoUpgrade = calcularUpgrade(
            comisionesOriginales.precioEstandar,
            comisionesNuevas.precioEstandar,
            precioCobrado,
            moneda,
            metodoPago
        );

        if (!resultadoUpgrade.esValido) {
            const invalidUpgradeEmbed = new EmbedBuilder()
                .setDescription(`**Error en el upgrade:**\n${resultadoUpgrade.error}`)
                .setColor('#FF0000');

            return await interaction.editReply({
                embeds: [invalidUpgradeEmbed]
            });
        }

        const numeroUpgrade = sales.length + 1;

        const upgradeData = {
            numeroVenta: numeroUpgrade,
            tipoVenta: 'upgrade',
            vendedor: interaction.user.tag,
            vendedorId: interaction.user.id,
            canal: interaction.channel.name,
            canalId: interaction.channelId,
            usuario: ventaOriginal.usuario || 'N/A',
            whatsapp: ventaOriginal.whatsapp,
            ventaOriginalId: ventaOriginalId,
            productoOriginal: productoOriginal,
            periodoOriginal: periodoOriginal,
            precioOriginal: comisionesOriginales.precioEstandar,
            productoNuevo: productoNuevo,
            periodoNuevo: periodoNuevo,
            precioNuevo: comisionesNuevas.precioEstandar,
            diferenciaEsperada: resultadoUpgrade.diferenciaEsperada,
            montoCobrado: precioCobrado,
            monedaOriginal: moneda,
            metodoPago: metodoPago,
            montoBrutoCliente: resultadoUpgrade.montoBruto,
            comisionMetodoPago: resultadoUpgrade.comisionMetodoPago,
            montoNetoRecibido: resultadoUpgrade.montoNeto,
            montoNetoSoles: resultadoUpgrade.montoNetoSoles,
            comisionMetodoPagoSoles: resultadoUpgrade.comisionMetodoPagoSoles,
            comisionVenta: comisionUpgrade,
            comisionVendedor: comisionUpgrade,
            comisionSoporte: comisionSoporte,
            requiereSoporte: requiereSoporte,
            vendedorSoporte: requiereSoporte ? 'Pendiente' : 'No requerido',
            vendedorSoporteId: null,
            nota: nota,
            imagen: comprobante ? comprobante.url : null,
            fecha: new Date().toISOString()
        };

        const embed = new EmbedBuilder()
            .setTitle(`> UPGRADE #${numeroUpgrade.toString().padStart(3, '0')}`)
            .setDescription(
                `**Vendedor:** <@${interaction.user.id}>\n` +
                `**Upgrade:** ${productoOriginal} ${periodoOriginal} → ${productoNuevo} ${periodoNuevo}`
            )
            .addFields(
                { name: 'Venta Original', value: `#${ventaOriginalId}`, inline: true },
                { name: 'WhatsApp', value: ventaOriginal.whatsapp, inline: true },
                { 
                    name: 'Soporte', 
                    value: requiereSoporte ? 'Reacciona con ✅' : 'No requerido', 
                    inline: true 
                },
                { name: '\u200b', value: liston, inline: false },
                { name: 'Método Pago', value: metodoPago, inline: true },
                { name: 'Monto Cobrado', value: `${precioCobrado} ${moneda}`, inline: true },
                { name: '\u200b', value: '\u200b', inline: true }
            );

        if (nota) {
            embed.addFields({ name: '\u200b', value: liston, inline: false });
            embed.addFields({ name: 'Nota', value: nota, inline: false });
        }

        embed.setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        if (comprobante) {
            embed.setImage(comprobante.url);
        }

        const adminMentions = `<@&${roles.ADMIN[0]}>`;
        const mencionSoporte = requiereSoporte ? `<@&${roles.SUPPORT}>` : '';

        const reply = await interaction.editReply({
            content: `${adminMentions} ${mencionSoporte}`,
            embeds: [embed],
            fetchReply: true
        });

        upgradeData.messageId = reply.id;
        sales.push(upgradeData);
        saveSales(sales);

        try {
            const ventaOriginalChannel = await interaction.client.channels.fetch(ventaOriginal.canalId);
            if (ventaOriginalChannel && ventaOriginal.messageId) {
                const ventaOriginalMessage = await ventaOriginalChannel.messages.fetch(ventaOriginal.messageId);
                
                const upgradeNoticeEmbed = new EmbedBuilder()
                    .setDescription(
                        `**Esta venta ha sido upgradeada**\n\n` +
                        `**Upgrade:** ${productoOriginal} ${periodoOriginal} → ${productoNuevo} ${periodoNuevo}\n` +
                        `**Registrado en:** <#${interaction.channelId}>`
                    )
                    .setColor(config.embedColor)
                    .setTimestamp();

                await ventaOriginalMessage.reply({
                    embeds: [upgradeNoticeEmbed]
                });
            }
        } catch (error) {
            console.error('No se pudo responder a la venta original:', error);
        }

        if (requiereSoporte) {
            await reply.react('✅');

            const filter = (reaction, user) => {
                return reaction.emoji.name === '✅' && !user.bot;
            };

            const collector = reply.createReactionCollector({ 
                filter,
                dispose: true
            });

            let soporteAsignado = false;
            let collectorActivo = true;

            const mensajeExiste = async () => {
                try {
                    await interaction.channel.messages.fetch(reply.id);
                    return true;
                } catch (error) {
                    console.log(`❌ Mensaje de upgrade #${numeroUpgrade} fue eliminado. Deteniendo recordatorios.`);
                    return false;
                }
            };

            const recordatorio10min = setTimeout(async () => {
                if (!soporteAsignado && await mensajeExiste()) {
                    const reminderEmbed = new EmbedBuilder()
                        .setDescription(
                            `**RECORDATORIO:** UPGRADE #${numeroUpgrade.toString().padStart(3, '0')} sin asignar\n\n` +
                            `Han pasado 10 minutos y este upgrade aún no tiene soporte asignado.\n` +
                            `Por favor, reacciona con ✅ para asignarte.`
                        )
                        .setColor(config.embedColor)
                        .setTimestamp();

                    await interaction.channel.send({ 
                        content: `<@&${roles.SUPPORT}>`,
                        embeds: [reminderEmbed],
                        reply: { messageReference: reply.id }
                    });

                    console.log(`⏰ Recordatorio de 10 min enviado para upgrade #${numeroUpgrade}`);
                }
            }, 10 * 60 * 1000);

            const recordatoriosHora = [];
            for (let i = 1; i <= 11; i++) {
                const tiempoEspera = (10 + (i * 60)) * 60 * 1000;
                
                const recordatorio = setTimeout(async () => {
                    if (!soporteAsignado && await mensajeExiste()) {
                        const horasTranscurridas = Math.floor((10 + (i * 60)) / 60);
                        
                        const reminderEmbed = new EmbedBuilder()
                            .setDescription(
                                `**RECORDATORIO:** UPGRADE #${numeroUpgrade.toString().padStart(3, '0')} sin asignar\n\n` +
                                `Han pasado ${horasTranscurridas} hora(s) y este upgrade aún no tiene soporte asignado.\n` +
                                `Por favor, reacciona con ✅ para asignarte.`
                            )
                            .setColor(config.embedColor)
                            .setTimestamp();

                        await interaction.channel.send({ 
                            content: `<@&${roles.SUPPORT}>`,
                            embeds: [reminderEmbed],
                            reply: { messageReference: reply.id }
                        });

                        console.log(`⏰ Recordatorio de ${horasTranscurridas}h enviado para upgrade #${numeroUpgrade}`);
                    }
                }, tiempoEspera);

                recordatoriosHora.push(recordatorio);
            }

            const timeoutDuration = 12 * 60 * 60 * 1000;
            const timeoutTimer = setTimeout(async () => {
                if (!soporteAsignado && await mensajeExiste()) {
                    collectorActivo = false;
                    collector.stop('timeout');

                    const salesUpdated = loadSales();
                    const upgradeIndex = salesUpdated.findIndex(v => v.numeroVenta === numeroUpgrade);
                    if (upgradeIndex !== -1) {
                        salesUpdated[upgradeIndex].vendedorSoporte = 'Expirado (12h)';
                        salesUpdated[upgradeIndex].soporteBloqueado = true;
                        salesUpdated[upgradeIndex].fechaExpiracion = new Date().toISOString();
                        saveSales(salesUpdated);
                    }

                    try {
                        const updatedEmbed = EmbedBuilder.from(embed)
                            .spliceFields(2, 1, { 
                                name: 'Soporte', 
                                value: 'Expirado (12h sin asignar)', 
                                inline: true 
                            });

                        await reply.edit({ embeds: [updatedEmbed] });
                    } catch (error) {
                        console.log(`❌ No se pudo editar mensaje de upgrade #${numeroUpgrade} (ya fue eliminado)`);
                    }

                    const timeoutEmbed = new EmbedBuilder()
                        .setDescription(
                            `⏱️ **Upgrade #${numeroUpgrade.toString().padStart(3, '0')} expirado**\n\n` +
                            `Han pasado 12 horas sin que un soporte marque este upgrade.\n` +
                            `El upgrade ha sido bloqueado y ya no se puede asignar soporte.`
                        )
                        .setColor('#FF0000')
                        .setTimestamp();

                    await interaction.channel.send({ 
                        content: `<@${interaction.user.id}> <@&${roles.ADMIN[0]}>`,
                        embeds: [timeoutEmbed],
                        reply: { messageReference: reply.id }
                    });

                    console.log(`⏱️ Upgrade #${numeroUpgrade} expiró después de 12 horas sin soporte asignado`);
                }
            }, timeoutDuration);

            collector.on('collect', async (reaction, user) => {
                if (!collectorActivo) {
                    await reaction.users.remove(user.id);
                    
                    const expiredEmbed = new EmbedBuilder()
                        .setDescription(`⏱️ <@${user.id}>, este upgrade expiró hace más de 12 horas y ya no se puede asignar soporte.`)
                        .setColor('#FF0000');
                    
                    const expiredMsg = await interaction.channel.send({ 
                        content: `<@${user.id}>`,
                        embeds: [expiredEmbed] 
                    });
                    
                    setTimeout(() => {
                        expiredMsg.delete().catch(err => console.log('No se pudo eliminar el mensaje:', err));
                    }, 10000);
                    
                    return;
                }

                if (soporteAsignado && upgradeData.vendedorSoporteId !== user.id) {
                    await reaction.users.remove(user.id);
                    
                    const warningEmbed = new EmbedBuilder()
                        .setDescription(`⚠️ <@${user.id}>, este upgrade ya tiene un soporte asignado (<@${upgradeData.vendedorSoporteId}>). Si deseas asignarte, el soporte actual debe quitar su reacción primero.`)
                        .setColor(config.embedColor);
                    
                    const warningMsg = await interaction.channel.send({ 
                        content: `<@${user.id}>`,
                        embeds: [warningEmbed] 
                    });
                    
                    setTimeout(() => {
                        warningMsg.delete().catch(err => console.log('No se pudo eliminar el mensaje:', err));
                    }, 10000);
                    
                    return;
                }

                console.log(`✅ ${user.tag} reaccionó - Asignando como soporte de upgrade #${numeroUpgrade}`);

                clearTimeout(recordatorio10min);
                clearTimeout(timeoutTimer);
                recordatoriosHora.forEach(timer => clearTimeout(timer));

                upgradeData.vendedorSoporte = user.tag;
                upgradeData.vendedorSoporteId = user.id;

                const salesUpdated = loadSales();
                const upgradeIndex = salesUpdated.findIndex(v => v.numeroVenta === numeroUpgrade);
                if (upgradeIndex !== -1) {
                    salesUpdated[upgradeIndex].vendedorSoporte = user.tag;
                    salesUpdated[upgradeIndex].vendedorSoporteId = user.id;
                    salesUpdated[upgradeIndex].fechaAsignacionSoporte = new Date().toISOString();
                    saveSales(salesUpdated);
                }

                const updatedEmbed = EmbedBuilder.from(embed)
                    .spliceFields(2, 1, { name: 'Soporte', value: `<@${user.id}>`, inline: true });

                await reply.edit({ embeds: [updatedEmbed] });

                const notificationEmbed = new EmbedBuilder()
                    .setDescription(
                        !soporteAsignado 
                            ? `<@${user.id}> ha sido asignado como soporte del upgrade #${numeroUpgrade.toString().padStart(3, '0')}.`
                            : `El soporte ha sido reasignado a <@${user.id}> para el upgrade #${numeroUpgrade.toString().padStart(3, '0')}.`
                    )
                    .setColor(config.embedColor);

                const notificationMsg = await interaction.channel.send({ embeds: [notificationEmbed] });

                setTimeout(() => {
                    notificationMsg.delete().catch(err => console.log('No se pudo eliminar el mensaje:', err));
                }, 60000);

                soporteAsignado = true;
            });

            collector.on('remove', async (reaction, user) => {
                console.log(`❌ ${user.tag} quitó su reacción de upgrade #${numeroUpgrade}`);

                const salesUpdated = loadSales();
                const upgrade = salesUpdated.find(v => v.numeroVenta === numeroUpgrade);

                if (upgrade && upgrade.vendedorSoporteId === user.id) {
                    upgrade.vendedorSoporte = 'Pendiente';
                    upgrade.vendedorSoporteId = null;

                    const upgradeIndex = salesUpdated.findIndex(v => v.numeroVenta === numeroUpgrade);
                    if (upgradeIndex !== -1) {
                        salesUpdated[upgradeIndex] = upgrade;
                        saveSales(salesUpdated);
                    }

                    const updatedEmbed = EmbedBuilder.from(embed)
                        .spliceFields(2, 1, { name: 'Soporte', value: 'Reacciona con ✅', inline: true });

                    await reply.edit({ embeds: [updatedEmbed] });

                    const liberationEmbed = new EmbedBuilder()
                        .setDescription(`⚠️ <@${user.id}> ha liberado el soporte del upgrade #${numeroUpgrade.toString().padStart(3, '0')}. Disponible para otro soporte.`)
                        .setColor(config.embedColor);

                    const liberationMsg = await interaction.channel.send({ embeds: [liberationEmbed] });

                    setTimeout(() => {
                        liberationMsg.delete().catch(err => console.log('No se pudo eliminar el mensaje:', err));
                    }, 60000);

                    soporteAsignado = false;
                    upgradeData.vendedorSoporte = 'Pendiente';
                    upgradeData.vendedorSoporteId = null;
                }
            });

            console.log(`🟢 Collector activo para upgrade #${numeroUpgrade} (recordatorios: 10min + cada 1h hasta 12h)`);
        } else {
            const reactionCollector = reply.createReactionCollector({
                filter: (reaction, user) => !user.bot,
                dispose: true
            });

            reactionCollector.on('collect', async (reaction, user) => {
                await reaction.users.remove(user.id);
                
                const noSupportEmbed = new EmbedBuilder()
                    .setDescription(`<@${user.id}>, este upgrade no requiere soporte. No puedes reaccionar.`)
                    .setColor('#FF0000');
                
                const noSupportMsg = await interaction.channel.send({ 
                    content: `<@${user.id}>`,
                    embeds: [noSupportEmbed] 
                });
                
                setTimeout(() => {
                    noSupportMsg.delete().catch(err => console.log('No se pudo eliminar el mensaje:', err));
                }, 5000);
            });

            console.log(`Upgrade #${numeroUpgrade} registrado SIN SOPORTE (reacciones bloqueadas)`);
        }

        console.log(`Upgrade #${numeroUpgrade} registrado: ${productoOriginal} ${periodoOriginal} → ${productoNuevo} ${periodoNuevo} | Com Venta: S/ ${comisionUpgrade.toFixed(2)} | Com Soporte: S/ ${comisionSoporte.toFixed(2)}`);

        const successEmbed = new EmbedBuilder()
            .setTitle('> HyperV - Upgrade Registrado')
            .setDescription(
                `**Upgrade:** ${productoOriginal} ${periodoOriginal} → ${productoNuevo} ${periodoNuevo}`
            )
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        await interaction.followUp({
            embeds: [successEmbed],
            ephemeral: true
        });
    }
};