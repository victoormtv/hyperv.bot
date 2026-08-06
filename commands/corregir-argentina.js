// commands/admin/corregirArgentina.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const {
    convertToSoles,
    calcularMontoNeto,
    calcularAjusteAutomatico
} = require('../data/commissionRules');

const salesFilePath = path.join(__dirname, '../data/sales.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('corregir-argentina')
        .setDescription('Corrige todas las ventas antiguas de Argentina')
        .setDefaultMemberPermissions(0), // Solo administradores

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Crear backup
            const salesOriginal = fs.readFileSync(salesFilePath, 'utf-8');
            const backupPath = path.join(__dirname, '../data/sales_backup.json');
            fs.writeFileSync(backupPath, salesOriginal);

            const sales = JSON.parse(salesOriginal);
            let ventasCorregidas = 0;
            let cambios = [];

            sales.forEach((venta) => {
                if (venta.monedaOriginal !== 'ARS' || venta.corregidoArgentina) {
                    return;
                }

                const precioAnterior = venta.precioRealSoles;

                // Recalcular con fórmula correcta
                const detallesPago = calcularMontoNeto(
                    venta.montoBrutoCliente,
                    venta.metodoPago,
                    venta.monedaOriginal
                );

                const montoNetoSolesCorregido = convertToSoles(
                    detallesPago.montoNeto,
                    venta.monedaOriginal
                );

                const ajusteCorregido = calcularAjusteAutomatico(
                    montoNetoSolesCorregido,
                    venta.precioEstandar
                );

                let comisionVentaCorregida = venta.comisionVentaBase;

                if (venta.tipoVenta === 'ads') {
                    comisionVentaCorregida *= 0.85;
                }

                if (ajusteCorregido.tipo === 'descuento') {
                    comisionVentaCorregida *= (montoNetoSolesCorregido / venta.precioEstandar);
                }

                // Actualizar
                venta.precioRealSoles = parseFloat(montoNetoSolesCorregido.toFixed(2));
                venta.descuento = ajusteCorregido.descuento;
                venta.propina = ajusteCorregido.propina;
                venta.tipoAjuste = ajusteCorregido.tipo;
                venta.diferenciaPorcentaje = ajusteCorregido.diferenciaPorcentaje;
                venta.comisionVenta = parseFloat(comisionVentaCorregida.toFixed(2));
                venta.corregidoArgentina = true;
                venta.fechaCorreccion = new Date().toISOString();

                cambios.push({
                    numero: venta.numeroVenta,
                    monto: venta.montoBrutoCliente,
                    antes: precioAnterior,
                    despues: venta.precioRealSoles,
                    diferencia: (venta.precioRealSoles - precioAnterior).toFixed(2)
                });

                ventasCorregidas++;
            });

            // Guardar
            fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));

            // Crear embed con resultados
            const embed = new EmbedBuilder()
                .setTitle('✅ Corrección de Ventas Argentina Completada')
                .setDescription(
                    `**Ventas corregidas:** ${ventasCorregidas}\n` +
                    `**Backup guardado:** sales_backup.json\n\n` +
                    `**Cambios realizados:**\n` +
                    cambios.slice(0, 10).map(c => 
                        `Venta #${c.numero}: ${c.monto} ARS → ${c.antes} → ${c.despues} PEN (${c.diferencia} PEN)`
                    ).join('\n') +
                    (cambios.length > 10 ? `\n\n...y ${cambios.length - 10} más` : '')
                )
                .setColor('#00FF00')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error corrigiendo ventas:', error);
            await interaction.editReply({
                content: `❌ Error: ${error.message}`
            });
        }
    }
};
