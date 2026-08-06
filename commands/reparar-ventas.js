const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../data/config');
const {
    getCommission,
    convertToSoles,
    obtenerComisionFijaPorMoneda,
    calcularMontoNeto,
    calcularAjusteAutomatico
} = require('../data/commissionRules');


const salesFilePath = path.join(__dirname, '../data/sales.json');

function loadSales() {
    if (!fs.existsSync(salesFilePath)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(salesFilePath, 'utf-8'));
}


function saveSales(sales) {
    fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));
}


function obtenerMesYAnio(fecha) {
    const date = new Date(fecha);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}


function recalcularComisionCompleta(venta) {
    // FIX: validar que existan los campos mínimos antes de operar sobre ellos.
    // Antes, si venta.producto o venta.periodo eran undefined, la línea
    // `venta.producto.includes('+')` tiraba un TypeError genérico que no
    // decía nada útil, y como pasaba en el try/catch de arriba, la venta
    // caía silenciosamente a "errores" sin explicación clara.
    if (!venta.producto || !venta.periodo) {
        throw new Error(
            `Falta producto o periodo (producto="${venta.producto}", periodo="${venta.periodo}")`
        );
    }

    const productos = venta.producto.includes('+')
        ? venta.producto.split('+').map(p => p.trim())
        : [venta.producto];

    const periodos = venta.periodo.includes('+')
        ? venta.periodo.split('+').map(p => p.trim())
        : [venta.periodo];

    let comisionVentaBase = 0;
    let comisionSoporteBase = 0;
    let precioEstandarTotal = 0;

    productos.forEach((producto, index) => {
        const periodo = periodos[index] || periodos[0];
        try {
            const comisiones = getCommission(producto, periodo);
            comisionVentaBase += comisiones.venta;
            comisionSoporteBase += comisiones.soporte;
            precioEstandarTotal += comisiones.precioEstandar;
        } catch (error) {
            console.log(`⚠️ No se pudo obtener comisión para ${producto} - ${periodo}`);
        }
    });

    if (!venta.requiereSoporte) {
        comisionSoporteBase = 0;
    }

    const detallesPago = calcularMontoNeto(
        venta.montoBrutoCliente,
        venta.metodoPago,
        venta.monedaOriginal
    );

    const montoNetoSoles = convertToSoles(detallesPago.montoNeto, venta.monedaOriginal);
    const ajuste = calcularAjusteAutomatico(montoNetoSoles, precioEstandarTotal);

    let comisionVentaFinal = comisionVentaBase;

    if (venta.tipoVenta === 'ads') {
        comisionVentaFinal = comisionVentaFinal * 0.85;
    }

    if (ajuste.tipo === 'descuento') {
        const factorDescuento = montoNetoSoles / precioEstandarTotal;
        comisionVentaFinal = comisionVentaFinal * factorDescuento;
    }

    if (ajuste.tipo === 'propina') {
        comisionVentaFinal += ajuste.propina;
    }

    const comisionFija = obtenerComisionFijaPorMoneda(venta.monedaOriginal);
    if (comisionFija > 0) {
        comisionVentaFinal += comisionFija;
    }

    return {
        comisionVenta: parseFloat(comisionVentaFinal.toFixed(2)),
        comisionSoporte: parseFloat(comisionSoporteBase.toFixed(2)),
        comisionVentaBase: comisionVentaBase,
        comisionSoporteBase: comisionSoporteBase,
        comisionFija: comisionFija,
        precioEstandar: precioEstandarTotal,
        ajuste: ajuste
    };
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('reparar-ventas')
        .setDescription('Reparar comisiones de TODAS las ventas de un mes')
        .addStringOption(option =>
            option.setName('mes')
                .setDescription('Mes a reparar (formato: YYYY-MM, ejemplo: 2026-02)')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('vista_previa')
                .setDescription('Ver cambios sin aplicarlos (default: true)')
                .setRequired(false))
        .setDefaultMemberPermissions(0),


    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const mesSeleccionado = interaction.options.getString('mes');
        const vistaPrevia = interaction.options.getBoolean('vista_previa') ?? true;

        const mesRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
        if (!mesRegex.test(mesSeleccionado)) {
            return await interaction.editReply({
                content: '❌ Formato de mes inválido. Usa el formato YYYY-MM (ejemplo: 2026-02)',
                ephemeral: true
            });
        }

        const sales = loadSales();

        if (sales.length === 0) {
            return await interaction.editReply({
                content: '❌ No hay ventas registradas.',
                ephemeral: true
            });
        }

        const ventasDelMes = sales.filter(venta => {
            const mesVenta = obtenerMesYAnio(venta.fecha);
            return mesVenta === mesSeleccionado;
        });

        if (ventasDelMes.length === 0) {
            return await interaction.editReply({
                content: `❌ No se encontraron ventas en ${mesSeleccionado}.`,
                ephemeral: true
            });
        }

        console.log(`🔧 Analizando ${ventasDelMes.length} ventas del mes ${mesSeleccionado}...`);

        const cambios = [];
        let errores = [];
        let categorias = {
            propinas: 0,
            descuentos: 0,
            comisionesFijas: 0,
            ads: 0,
            otros: 0
        };

        ventasDelMes.forEach(venta => {
            try {
                const comisionAnterior = venta.comisionVenta;
                const recalculado = recalcularComisionCompleta(venta);
                const comisionCorregida = recalculado.comisionVenta;

                const diferencia = comisionCorregida - comisionAnterior;
                const necesitaReparacion = Math.abs(diferencia) > 0.1;

                if (necesitaReparacion) {
                    let tipoError = 'otros';
                    if (recalculado.ajuste.tipo === 'propina') {
                        tipoError = 'propinas';
                        categorias.propinas++;
                    } else if (recalculado.ajuste.tipo === 'descuento') {
                        tipoError = 'descuentos';
                        categorias.descuentos++;
                    } else if (recalculado.comisionFija > 0) {
                        tipoError = 'comisionesFijas';
                        categorias.comisionesFijas++;
                    } else if (venta.tipoVenta === 'ads') {
                        tipoError = 'ads';
                        categorias.ads++;
                    } else {
                        categorias.otros++;
                    }

                    cambios.push({
                        numeroVenta: venta.numeroVenta,
                        vendedor: venta.vendedor,
                        producto: venta.producto || 'N/A',
                        periodo: venta.periodo || 'N/A',
                        tipoError: tipoError,
                        propina: recalculado.ajuste.propina || 0,
                        descuento: recalculado.ajuste.descuento || 0,
                        comisionFija: recalculado.comisionFija,
                        comisionAnterior: parseFloat(comisionAnterior.toFixed(2)),
                        comisionCorregida: comisionCorregida,
                        diferencia: parseFloat(diferencia.toFixed(2))
                    });

                    if (!vistaPrevia) {
                        venta.comisionVenta = comisionCorregida;
                        venta.comisionSoporte = recalculado.comisionSoporte;
                        venta.comisionVentaBase = recalculado.comisionVentaBase;
                        venta.comisionSoporteBase = recalculado.comisionSoporteBase;
                        venta.comisionFija = recalculado.comisionFija;
                        venta.precioEstandar = recalculado.precioEstandar;
                        venta.descuento = recalculado.ajuste.descuento;
                        venta.propina = recalculado.ajuste.propina;
                        venta.tipoAjuste = recalculado.ajuste.tipo;
                        venta.reparado = true;
                        venta.fechaReparacion = new Date().toISOString();
                        venta.reparadoPor = interaction.user.tag;
                    }
                }
            } catch (error) {
                errores.push({
                    numeroVenta: venta.numeroVenta,
                    error: error.message
                });
            }
        });

        if (cambios.length === 0 && errores.length === 0) {
            return await interaction.editReply({
                content: `✅ Todas las ventas del mes ${mesSeleccionado} ya tienen las comisiones correctas.`,
                ephemeral: true
            });
        }

        if (!vistaPrevia) {
            saveSales(sales);
            console.log(`✅ Se guardaron ${cambios.length} reparaciones en sales.json`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`🔧 ${vistaPrevia ? 'Vista Previa: ' : ''}Reparación Completa - ${mesSeleccionado}`)
            .setDescription(
                vistaPrevia
                    ? '**Modo Vista Previa**: Los cambios NO han sido aplicados.\nUsa `vista_previa: False` para aplicar los cambios.'
                    : '**✅ Cambios aplicados exitosamente**'
            )
            .addFields(
                { name: 'Total ventas', value: `${ventasDelMes.length}`, inline: true },
                { name: 'Ventas reparadas', value: `${cambios.length}`, inline: true },
                { name: 'Errores', value: `${errores.length}`, inline: true }
            )
            .setColor(vistaPrevia ? '#FFA500' : '#00FF00')
            .setFooter(config.embedFooter)
            .setTimestamp();

        if (cambios.length > 0) {
            let categoriasTexto = '';
            if (categorias.propinas > 0) categoriasTexto += `Propinas: ${categorias.propinas}\n`;
            if (categorias.descuentos > 0) categoriasTexto += `Descuentos: ${categorias.descuentos}\n`;
            if (categorias.comisionesFijas > 0) categoriasTexto += `Comisiones fijas: ${categorias.comisionesFijas}\n`;
            if (categorias.ads > 0) categoriasTexto += `Descuento Ads: ${categorias.ads}\n`;
            if (categorias.otros > 0) categoriasTexto += `Otros: ${categorias.otros}\n`;

            embed.addFields({
                name: 'Tipos de correcciones',
                value: categoriasTexto || 'N/A',
                inline: false
            });
        }

        if (cambios.length > 0) {
            let detallesTexto = '';
            const cambiosMostrar = cambios.slice(0, 8);

            cambiosMostrar.forEach(cambio => {
                const iconos = {
                    propinas: '💰',
                    descuentos: '💸',
                    comisionesFijas: '🔧',
                    ads: '📢',
                    otros: '🔄'
                };

                detallesTexto += `${iconos[cambio.tipoError]} **#${cambio.numeroVenta}** - ${cambio.vendedor}\n`;
                detallesTexto += `${cambio.comisionAnterior} → ${cambio.comisionCorregida} PEN `;
                detallesTexto += `(${cambio.diferencia > 0 ? '+' : ''}${cambio.diferencia})\n\n`;
            });

            if (cambios.length > 8) {
                detallesTexto += `*... y ${cambios.length - 8} ventas más*`;
            }

            embed.addFields({
                name: 'Cambios Detallados',
                value: detallesTexto,
                inline: false
            });
        }

        // FIX: mostrar una muestra de errores directo en el embed, para
        // diagnosticar sin depender de que se haya generado el log.
        if (errores.length > 0) {
            const erroresMuestra = errores.slice(0, 5)
                .map(e => `#${e.numeroVenta}: ${e.error}`)
                .join('\n');

            embed.addFields({
                name: `⚠️ Errores (muestra de ${Math.min(5, errores.length)} de ${errores.length})`,
                value: erroresMuestra || 'N/A',
                inline: false
            });
        }

        await interaction.editReply({ embeds: [embed], ephemeral: true });
        if (cambios.length > 0 || errores.length > 0) {
            let logTexto = `REPARACIÓN COMPLETA DE VENTAS - ${mesSeleccionado}\n`;
            logTexto += `Fecha: ${new Date().toLocaleString('es-PE')}\n`;
            logTexto += `Ejecutado por: ${interaction.user.tag}\n`;
            logTexto += `Modo: ${vistaPrevia ? 'Vista Previa' : 'Aplicado'}\n`;
            logTexto += `Total reparaciones: ${cambios.length}\n`;
            logTexto += `Total errores: ${errores.length}\n\n`;
            logTexto += `CATEGORÍAS:\n`;
            logTexto += `- Propinas mal calculadas: ${categorias.propinas}\n`;
            logTexto += `- Descuentos mal aplicados: ${categorias.descuentos}\n`;
            logTexto += `- Comisiones fijas incorrectas: ${categorias.comisionesFijas}\n`;
            logTexto += `- Descuento Ads incorrecto: ${categorias.ads}\n`;
            logTexto += `- Otros errores: ${categorias.otros}\n`;
            logTexto += `${'='.repeat(80)}\n\n`;

            cambios.forEach(cambio => {
                logTexto += `Venta #${cambio.numeroVenta} [${cambio.tipoError.toUpperCase()}]\n`;
                logTexto += `Vendedor: ${cambio.vendedor}\n`;
                logTexto += `Producto: ${cambio.producto} - ${cambio.periodo}\n`;
                if (cambio.propina > 0) logTexto += `Propina: ${cambio.propina.toFixed(2)} PEN\n`;
                if (cambio.descuento > 0) logTexto += `Descuento: ${cambio.descuento.toFixed(2)} PEN\n`;
                if (cambio.comisionFija > 0) logTexto += `Comisión Fija: ${cambio.comisionFija} PEN\n`;
                logTexto += `Comisión anterior: ${cambio.comisionAnterior} PEN\n`;
                logTexto += `Comisión corregida: ${cambio.comisionCorregida} PEN\n`;
                logTexto += `Diferencia: ${cambio.diferencia > 0 ? '+' : ''}${cambio.diferencia} PEN\n`;
                logTexto += `${'-'.repeat(80)}\n\n`;
            });

            if (errores.length > 0) {
                logTexto += `\n${'='.repeat(80)}\nERRORES:\n\n`;
                errores.forEach(error => {
                    logTexto += `Venta #${error.numeroVenta}: ${error.error}\n`;
                });
            }

            const logsDir = path.join(__dirname, '../data/logs');
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }

            const logFileName = `reparacion-completa-${mesSeleccionado}-${Date.now()}.txt`;
            const logPath = path.join(logsDir, logFileName);

            try {
                fs.writeFileSync(logPath, logTexto);
                console.log(`📄 Log guardado en: ${logPath}`);

                await interaction.followUp({
                    content: `📄 Log completo de reparación generado.`,
                    files: [logPath],
                    ephemeral: true
                });
            } catch (error) {
                console.error('❌ Error guardando log:', error);
            }
        }
    }
};