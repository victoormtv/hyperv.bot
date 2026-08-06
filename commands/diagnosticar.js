const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { roles } = require('../data/ids');

const salesFilePath = path.join(__dirname, '../data/sales.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diagnosticar')
        .setDescription('Diagnosticar TODAS las ventas registradas'),

    async execute(interaction) {
        // Solo admins pueden usar este comando
        const isAdmin = roles.ADMIN.some(roleId => 
            interaction.member.roles.cache.has(roleId)
        );

        if (!isAdmin) {
            return await interaction.reply({
                content: '❌ Solo los administradores pueden usar este comando.',
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const sales = JSON.parse(fs.readFileSync(salesFilePath, 'utf-8'));
            
            // Recopilar datos de TODAS las ventas
            const metodosPago = new Map();
            const monedas = new Map();
            const productos = new Map();
            
            sales.forEach(venta => {
                const metodo = venta.metodoPago || 'Sin método';
                const moneda = venta.monedaOriginal || 'Sin moneda';
                const producto = venta.producto || 'Sin producto';
                
                metodosPago.set(metodo, (metodosPago.get(metodo) || 0) + 1);
                monedas.set(moneda, (monedas.get(moneda) || 0) + 1);
                productos.set(producto, (productos.get(producto) || 0) + 1);
            });
            
            // Calcular totales de comisiones
            let totalComisionesVendedor = 0;
            let totalComisionesSoporte = 0;
            let totalMontoVentas = 0;
            
            sales.forEach(venta => {
                totalComisionesVendedor += venta.comisionVenta || 0;
                totalComisionesSoporte += venta.comisionSoporte || 0;
                totalMontoVentas += venta.precioRealSoles || 0;
            });
            
            // Ventas con descuento o propina
            const ventasConDescuento = sales.filter(v => v.tipoAjuste === 'descuento').length;
            const ventasConPropina = sales.filter(v => v.tipoAjuste === 'propina').length;
            const ventasRecalculadas = sales.filter(v => v.recalculado === true).length;
            
            // Crear embeds (Discord tiene límite de 25 campos)
            const embed1 = new EmbedBuilder()
                .setTitle('🔍 Diagnóstico Completo de Ventas')
                .setColor('#00FF00')
                .addFields(
                    { 
                        name: '📊 Resumen General', 
                        value: `**Total de ventas:** ${sales.length}\n` +
                               `**Monto total:** S/ ${totalMontoVentas.toFixed(2)}\n` +
                               `**Comisiones vendedores:** S/ ${totalComisionesVendedor.toFixed(2)}\n` +
                               `**Comisiones soporte:** S/ ${totalComisionesSoporte.toFixed(2)}\n` +
                               `**Ventas recalculadas:** ${ventasRecalculadas}`,
                        inline: false 
                    },
                    { 
                        name: '💳 Métodos de Pago', 
                        value: Array.from(metodosPago.entries())
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 15)
                            .map(([metodo, cant]) => `• ${metodo}: ${cant}`)
                            .join('\n') || 'Ninguno', 
                        inline: false 
                    }
                )
                .setTimestamp();

            const embed2 = new EmbedBuilder()
                .setColor('#00FF00')
                .addFields(
                    { 
                        name: '💰 Monedas Utilizadas', 
                        value: Array.from(monedas.entries())
                            .sort((a, b) => b[1] - a[1])
                            .map(([moneda, cant]) => `• ${moneda}: ${cant}`)
                            .join('\n') || 'Ninguna', 
                        inline: true 
                    },
                    { 
                        name: '🎮 Productos Más Vendidos', 
                        value: Array.from(productos.entries())
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 10)
                            .map(([prod, cant]) => `• ${prod}: ${cant}`)
                            .join('\n') || 'Ninguno', 
                        inline: true 
                    },
                    { 
                        name: '📈 Ajustes de Precio', 
                        value: `🔻 Descuentos: ${ventasConDescuento} ventas\n` +
                               `🔺 Propinas: ${ventasConPropina} ventas\n` +
                               `📊 Precio estándar: ${sales.length - ventasConDescuento - ventasConPropina} ventas`,
                        inline: false 
                    }
                )
                .setFooter({ text: 'Usa /recalcular para actualizar todas las ventas con las reglas actuales' });

            await interaction.editReply({ embeds: [embed1, embed2] });

        } catch (error) {
            console.error('Error al diagnosticar:', error);
            await interaction.editReply({
                content: `❌ Error al leer el archivo de ventas: ${error.message}`
            });
        }
    }
};
