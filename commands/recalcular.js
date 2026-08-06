const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { roles } = require('../data/ids');
const { 
    convertToSoles, 
    calcularMontoNeto,
    calcularAjusteAutomatico
} = require('../data/commissionRules');

const salesFilePath = path.join(__dirname, '../data/sales.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recalcular')
        .setDescription('Recalcular TODAS las ventas con las reglas actuales')
        .addBooleanOption(option =>
            option.setName('confirmar')
                .setDescription('Confirma que deseas recalcular TODAS las ventas')
                .setRequired(true)),

    async execute(interaction) {
        // Solo admins
        const isAdmin = roles.ADMIN.some(roleId => 
            interaction.member.roles.cache.has(roleId)
        );

        if (!isAdmin) {
            return await interaction.reply({
                content: '❌ Solo los administradores pueden usar este comando.',
                ephemeral: true
            });
        }

        const confirmar = interaction.options.getBoolean('confirmar');

        if (!confirmar) {
            return await interaction.reply({
                content: '⚠️ Debes confirmar la recalculación estableciendo el parámetro en `True`.',
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const sales = JSON.parse(fs.readFileSync(salesFilePath, 'utf-8'));
            
            // Crear backup antes de recalcular
            const backupPath = path.join(__dirname, `../data/sales_backup_${Date.now()}.json`);
            fs.writeFileSync(backupPath, JSON.stringify(sales, null, 2));
            
            let ventasActualizadas = 0;
            let errores = 0;
            const cambios = [];
            
            sales.forEach((venta, index) => {
                try {
                    // Guardar valores antiguos para comparar
                    const comisionViejaVendedor = venta.comisionVenta;
                    const montoViejoNeto = venta.precioRealSoles;
                    
                    // Recalcular con las reglas actuales
                    const detallesPago = calcularMontoNeto(
                        venta.montoBrutoCliente, 
                        venta.metodoPago, 
                        venta.monedaOriginal
                    );
                    
                    const montoNetoSoles = convertToSoles(detallesPago.montoNeto, venta.monedaOriginal);
                    const comisionMetodoPagoSoles = convertToSoles(detallesPago.comisionTotal, venta.monedaOriginal);
                    const ajuste = calcularAjusteAutomatico(montoNetoSoles, venta.precioEstandar);
                    
                    let comisionVentaFinal = venta.comisionVentaBase || 0;
                    
                    // Aplicar ajustes por descuento
                    if (ajuste.tipo === 'descuento') {
                        const factorDescuento = montoNetoSoles / venta.precioEstandar;
                        comisionVentaFinal = (venta.comisionVentaBase || 0) * factorDescuento;
                    }
                    
                    // Aplicar propina
                    if (ajuste.tipo === 'propina') {
                        comisionVentaFinal += ajuste.propina;
                    }
                    
                    // Agregar comisión fija si aplica
                    if (venta.comisionFija) {
                        comisionVentaFinal += venta.comisionFija;
                    }
                    
                    // Actualizar los valores
                    sales[index].montoNetoRecibido = parseFloat(detallesPago.montoNeto.toFixed(2));
                    sales[index].comisionMetodoPago = parseFloat(detallesPago.comisionTotal.toFixed(2));
                    sales[index].comisionMetodoPagoSoles = parseFloat(comisionMetodoPagoSoles.toFixed(2));
                    sales[index].precioRealSoles = parseFloat(montoNetoSoles.toFixed(2));
                    sales[index].comisionVenta = parseFloat(comisionVentaFinal.toFixed(2));
                    sales[index].descuento = ajuste.descuento;
                    sales[index].propina = ajuste.propina;
                    sales[index].tipoAjuste = ajuste.tipo;
                    sales[index].diferenciaPorcentaje = ajuste.diferenciaPorcentaje;
                    sales[index].recalculado = true;
                    sales[index].fechaRecalculo = new Date().toISOString();
                    
                    ventasActualizadas++;
                    
                    // Registrar cambios significativos (más del 5% de diferencia)
                    const diferenciaComision = Math.abs(comisionVentaFinal - comisionViejaVendedor);
                    if (diferenciaComision > 0.5 && cambios.length < 10) {
                        cambios.push({
                            numero: venta.numeroVenta,
                            metodo: venta.metodoPago,
                            moneda: venta.monedaOriginal,
                            comisionVieja: comisionViejaVendedor,
                            comisionNueva: comisionVentaFinal
                        });
                    }
                    
                } catch (error) {
                    console.error(`Error en venta #${venta.numeroVenta}:`, error);
                    errores++;
                }
            });
            
            // Guardar cambios
            fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));
            
            // Crear reporte de cambios
            const embed = new EmbedBuilder()
                .setTitle('✅ Recalculación Completada')
                .setDescription(
                    `Se han procesado **${sales.length}** ventas:\n` +
                    `✅ Actualizadas: **${ventasActualizadas}**\n` +
                    `❌ Errores: **${errores}**\n` +
                    `💾 Backup guardado en: \`${path.basename(backupPath)}\``
                )
                .setColor('#00FF00')
                .setTimestamp();

            if (cambios.length > 0) {
                embed.addFields({
                    name: '📊 Ejemplos de cambios significativos',
                    value: cambios.map(c => 
                        `• Venta #${c.numero} (${c.metodo} - ${c.moneda})\n` +
                        `  Comisión: S/ ${c.comisionVieja.toFixed(2)} → S/ ${c.comisionNueva.toFixed(2)}`
                    ).join('\n').slice(0, 1024),
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [embed] });
            
            // Log en consola para el servidor
            console.log('═══════════════════════════════════════');
            console.log(`✅ Recalculación completada por ${interaction.user.tag}`);
            console.log(`📊 Ventas procesadas: ${sales.length}`);
            console.log(`🔄 Ventas actualizadas: ${ventasActualizadas}`);
            console.log(`❌ Errores: ${errores}`);
            console.log(`💾 Backup: ${backupPath}`);
            console.log('═══════════════════════════════════════');

        } catch (error) {
            console.error('Error al recalcular:', error);
            await interaction.editReply({
                content: `❌ Error al recalcular ventas: ${error.message}`
            });
        }
    }
};
