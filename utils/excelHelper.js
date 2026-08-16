const ExcelJS = require('exceljs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

async function generateSalesExcel(ventas, mes = null, año = new Date().getFullYear(), quincena = null, diaInicio = null, diaFin = null) {
    const workbook = new ExcelJS.Workbook();

    let ventasFiltradas = ventas;

    if (!ventasFiltradas.length) {
        throw new Error('No hay ventas para el periodo seleccionado');
    }

    const colorPrincipal = 'FF013173';
    const colorUpgrade = 'FFFFD700';
    const colorPropina = 'FF90EE90';
    const colorAlterno = 'FFF5F5F5';
    const colorBordes = 'FFCCCCCC';
    const colorTextoBlanco = 'FFFFFFFF';
    const colorTextoNegro = 'FF000000';
    const colorAds = 'FFFF6B6B';
    const colorDiscord = 'FF5865F2';

    const ventasNormales = ventasFiltradas.filter(v =>
        v.tipoVenta !== 'upgrade' &&
        v.tipoVenta !== 'propina'
    );
    const ventasUpgrade = ventasFiltradas.filter(v => v.tipoVenta === 'upgrade');
    const propinas = ventasFiltradas.filter(v => v.tipoVenta === 'propina');
    const ventasAds = ventasFiltradas.filter(v => v.tipoVenta && v.tipoVenta.toLowerCase() === 'ads');
    const ventasDiscord = ventasFiltradas.filter(v => v.tipoVenta && v.tipoVenta.toLowerCase() === 'discord');

    const totalVentasAds = ventasAds.length;
    const totalVentasDiscord = ventasDiscord.length;

    const ingresosAds = ventasAds.reduce((sum, v) => {
        if (v.tipoVenta === 'upgrade') return sum + (v.montoNetoSoles || 0);
        else if (v.tipoVenta === 'propina') return sum + (v.precioRealSoles || 0);
        return sum + (v.precioRealSoles || v.precioEstandar || 0);
    }, 0);

    const ingresosDiscord = ventasDiscord.reduce((sum, v) => {
        if (v.tipoVenta === 'upgrade') return sum + (v.montoNetoSoles || 0);
        else if (v.tipoVenta === 'propina') return sum + (v.precioRealSoles || 0);
        return sum + (v.precioRealSoles || v.precioEstandar || 0);
    }, 0);

    const totalVentas = ventasFiltradas.length;
    const totalVentasNormales = ventasNormales.length;
    const totalUpgrades = ventasUpgrade.length;
    const totalPropinas = propinas.length;

    const comisionVentaTotal = ventasFiltradas.reduce((sum, v) => sum + (v.comisionVenta || 0), 0);
    const comisionSoporteTotal = ventasFiltradas.reduce((sum, v) => sum + (v.comisionSoporte || 0), 0);
    const comisionVentaNormal = ventasNormales.reduce((sum, v) => sum + (v.comisionVenta || 0), 0);
    const comisionVentaUpgrade = ventasUpgrade.reduce((sum, v) => sum + (v.comisionVendedor || v.comisionVenta || 0), 0);

    const ingresosTotales = ventasFiltradas.reduce((sum, v) => {
        if (v.tipoVenta === 'upgrade') return sum + (v.montoNetoSoles || 0);
        else if (v.tipoVenta === 'propina') return sum + (v.precioRealSoles || 0);
        return sum + (v.precioRealSoles || v.precioEstandar || 0);
    }, 0);

    const ingresosNormales = ventasNormales.reduce((sum, v) => sum + (v.precioRealSoles || v.precioEstandar || 0), 0);
    const ingresosUpgrades = ventasUpgrade.reduce((sum, v) => sum + (v.montoNetoSoles || 0), 0);
    const ingresosPropinas = propinas.reduce((sum, p) => sum + (p.precioRealSoles || 0), 0);
    const descuentosMetodoPagoPropinas = propinas.reduce((sum, p) => sum + (p.comisionMetodoPagoSoles || 0), 0);

    const ventasNormalesSinAjuste = ventasNormales.filter(v => v.tipoAjuste === 'ninguno').length;
    const ventasConDescuento = ventasNormales.filter(v => v.tipoAjuste === 'descuento').length;
    const ventasConPropina = ventasNormales.filter(v => v.tipoAjuste === 'propina').length;
    const totalDescuentos = ventasNormales.reduce((sum, v) => sum + (v.descuento || 0), 0);
    const totalPropinasAjuste = ventasNormales.reduce((sum, v) => sum + (v.propina || 0), 0);

    const resumenSheet = workbook.addWorksheet('Dashboard');

    resumenSheet.columns = [
        { header: 'Metrica', key: 'metrica', width: 45 },
        { header: 'Valor', key: 'valor', width: 30 }
    ];

    const ventasPorVendedor = {};
    ventasFiltradas.forEach(v => {
        if (!ventasPorVendedor[v.vendedor]) {
            ventasPorVendedor[v.vendedor] = { ventas: 0, ventasNormales: 0, upgrades: 0, propinas: 0, ingresos: 0 };
        }
        ventasPorVendedor[v.vendedor].ventas++;
        if (v.tipoVenta === 'upgrade') {
            ventasPorVendedor[v.vendedor].upgrades++;
            ventasPorVendedor[v.vendedor].ingresos += (v.montoNetoSoles || 0);
        } else if (v.tipoVenta === 'propina') {
            ventasPorVendedor[v.vendedor].propinas++;
            ventasPorVendedor[v.vendedor].ingresos += (v.precioRealSoles || 0);
        } else {
            ventasPorVendedor[v.vendedor].ventasNormales++;
            ventasPorVendedor[v.vendedor].ingresos += (v.precioRealSoles || v.precioEstandar || 0);
        }
    });

    const vendedorTop = Object.entries(ventasPorVendedor).sort((a, b) => b[1].ventas - a[1].ventas)[0];
    const vendedorBajo = Object.entries(ventasPorVendedor).sort((a, b) => a[1].ventas - b[1].ventas)[0];
    const vendedorTopUpgrades = Object.entries(ventasPorVendedor).sort((a, b) => b[1].upgrades - a[1].upgrades)[0];
    const vendedorTopPropinas = Object.entries(ventasPorVendedor).sort((a, b) => b[1].propinas - a[1].propinas)[0];

    const ventasPorProducto = {};
    ventasNormales.forEach(v => { ventasPorProducto[v.producto] = (ventasPorProducto[v.producto] || 0) + 1; });
    const productoTop = Object.entries(ventasPorProducto).sort((a, b) => b[1] - a[1])[0];
    const productoBajo = Object.entries(ventasPorProducto).sort((a, b) => a[1] - b[1])[0];

    const ventasPorPeriodo = {};
    ventasNormales.forEach(v => { ventasPorPeriodo[v.periodo] = (ventasPorPeriodo[v.periodo] || 0) + 1; });
    const periodoTop = Object.entries(ventasPorPeriodo).sort((a, b) => b[1] - a[1])[0];

    const ventasPorMoneda = {};
    ventasFiltradas.forEach(v => {
        const moneda = v.monedaOriginal || 'PEN';
        ventasPorMoneda[moneda] = (ventasPorMoneda[moneda] || 0) + 1;
    });

    resumenSheet.addRows([
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'RESUMEN GENERAL', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'REGISTROS TOTALES', valor: totalVentas },
        { metrica: '  ├─ Ventas Normales', valor: `${totalVentasNormales} (${((totalVentasNormales / totalVentas) * 100).toFixed(1)}%)` },
        { metrica: '  ├─ Upgrades', valor: `${totalUpgrades} (${((totalUpgrades / totalVentas) * 100).toFixed(1)}%)` },
        { metrica: '  └─ Propinas', valor: `${totalPropinas} (${((totalPropinas / totalVentas) * 100).toFixed(1)}%)` },
        { metrica: '', valor: '' },
        { metrica: 'INGRESOS TOTALES', valor: `S/ ${ingresosTotales.toFixed(2)}` },
        { metrica: '  ├─ Ventas Normales', valor: `S/ ${ingresosNormales.toFixed(2)}` },
        { metrica: '  ├─ Upgrades', valor: `S/ ${ingresosUpgrades.toFixed(2)}` },
        { metrica: '  └─ Propinas', valor: `S/ ${ingresosPropinas.toFixed(2)}` },
        { metrica: '', valor: '' },
        { metrica: 'COMISIONES TOTALES', valor: `S/ ${(comisionVentaTotal + comisionSoporteTotal).toFixed(2)}` },
        { metrica: '  ├─ Comisión Ventas', valor: `S/ ${comisionVentaTotal.toFixed(2)}` },
        { metrica: '  │   ├─ Ventas Normales', valor: `S/ ${comisionVentaNormal.toFixed(2)}` },
        { metrica: '  │   └─ Upgrades (30%)', valor: `S/ ${comisionVentaUpgrade.toFixed(2)}` },
        { metrica: '  └─ Comisión Soporte', valor: `S/ ${comisionSoporteTotal.toFixed(2)}` },
        { metrica: '', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'VENTAS POR TIPO', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'VENTAS DE ADS', valor: `${totalVentasAds} (${totalVentas > 0 ? ((totalVentasAds / totalVentas) * 100).toFixed(1) : '0.0'}%)` },
        { metrica: 'Ingresos Ads', valor: `S/ ${ingresosAds.toFixed(2)}` },
        { metrica: '', valor: '' },
        { metrica: 'VENTAS DE DISCORD', valor: `${totalVentasDiscord} (${totalVentas > 0 ? ((totalVentasDiscord / totalVentas) * 100).toFixed(1) : '0.0'}%)` },
        { metrica: 'Ingresos Discord', valor: `S/ ${ingresosDiscord.toFixed(2)}` },
        { metrica: '', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'VENTAS NORMALES', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'Ventas Sin Ajuste', valor: `${ventasNormalesSinAjuste} (${totalVentasNormales > 0 ? ((ventasNormalesSinAjuste / totalVentasNormales) * 100).toFixed(1) : '0.0'}%)` },
        { metrica: 'Ventas con Descuento', valor: `${ventasConDescuento} (${totalVentasNormales > 0 ? ((ventasConDescuento / totalVentasNormales) * 100).toFixed(1) : '0.0'}%)` },
        { metrica: 'Ventas con Propina Extra', valor: `${ventasConPropina} (${totalVentasNormales > 0 ? ((ventasConPropina / totalVentasNormales) * 100).toFixed(1) : '0.0'}%)` },
        { metrica: 'Total Descuentos Otorgados', valor: `S/ ${totalDescuentos.toFixed(2)}` },
        { metrica: 'Total Propinas Extra', valor: `S/ ${totalPropinasAjuste.toFixed(2)}` },
        { metrica: '', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'PROPINAS DIRECTAS', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'Total Propinas Directas', valor: totalPropinas },
        { metrica: 'Ingresos por Propinas', valor: `S/ ${ingresosPropinas.toFixed(2)}` },
        { metrica: 'Descuentos Metodos de Pago', valor: `S/ ${descuentosMetodoPagoPropinas.toFixed(2)}` },
        { metrica: 'Promedio por Propina', valor: totalPropinas > 0 ? `S/ ${(ingresosPropinas / totalPropinas).toFixed(2)}` : 'N/A' },
        { metrica: 'Vendedor Top Propinas', valor: vendedorTopPropinas && vendedorTopPropinas[1].propinas > 0 ? `${vendedorTopPropinas[0]} (${vendedorTopPropinas[1].propinas} propinas)` : 'N/A' },
        { metrica: '', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'UPGRADES DE PLANES', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'Total Upgrades Realizados', valor: totalUpgrades },
        { metrica: 'Ingresos por Upgrades', valor: `S/ ${ingresosUpgrades.toFixed(2)}` },
        { metrica: 'Comisiones Upgrades (30%)', valor: `S/ ${comisionVentaUpgrade.toFixed(2)}` },
        { metrica: 'Promedio por Upgrade', valor: totalUpgrades > 0 ? `S/ ${(ingresosUpgrades / totalUpgrades).toFixed(2)}` : 'N/A' },
        { metrica: 'Vendedor Top Upgrades', valor: vendedorTopUpgrades ? `${vendedorTopUpgrades[0]} (${vendedorTopUpgrades[1].upgrades} upgrades)` : 'N/A' },
        { metrica: '', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'TOP PERFORMERS', valor: '' },
        { metrica: '═══════════════════════════════════════', valor: '══════════════════════' },
        { metrica: 'VENDEDOR TOP', valor: `${vendedorTop[0]} (${vendedorTop[1].ventas} registros totales)` },
        { metrica: '  ├─ Ventas Normales', valor: vendedorTop[1].ventasNormales },
        { metrica: '  ├─ Upgrades', valor: vendedorTop[1].upgrades },
        { metrica: '  └─ Propinas', valor: vendedorTop[1].propinas },
        { metrica: 'Vendedor con menos registros', valor: `${vendedorBajo[0]} (${vendedorBajo[1].ventas} registros)` },
        { metrica: '', valor: '' },
        { metrica: 'PRODUCTO MAS VENDIDO', valor: productoTop ? `${productoTop[0]} (${productoTop[1]} ventas)` : 'N/A' },
        { metrica: 'Producto menos vendido', valor: productoBajo ? `${productoBajo[0]} (${productoBajo[1]} ventas)` : 'N/A' },
        { metrica: '', valor: '' },
        { metrica: 'PERIODO MAS POPULAR', valor: periodoTop ? `${periodoTop[0]} (${periodoTop[1]} ventas)` : 'N/A' },
        { metrica: '', valor: '' },
        { metrica: 'MONEDAS UTILIZADAS', valor: Object.keys(ventasPorMoneda).join(', ') }
    ]);

    const headerRowResumen = resumenSheet.getRow(1);
    headerRowResumen.font = { bold: true, size: 13, color: { argb: colorTextoBlanco } };
    headerRowResumen.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    headerRowResumen.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRowResumen.height = 28;

    resumenSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            const metrica = row.getCell(1).value;
            if (metrica && typeof metrica === 'string' && metrica.includes('═══')) {
                row.font = { bold: true, size: 11, color: { argb: colorPrincipal } };
                row.height = 8;
            } else if (metrica && typeof metrica === 'string' && (metrica.includes('RESUMEN') || metrica.includes('VENTAS') || metrica.includes('PROPINAS') || metrica.includes('UPGRADES') || metrica.includes('PERFORMERS') || metrica.includes('TIPO'))) {
                row.font = { bold: true, size: 12, color: { argb: colorTextoBlanco } };
                row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
                row.height = 24;
            } else {
                row.font = { size: 11, color: { argb: colorTextoNegro }, bold: false };
                row.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
                row.height = 22;
                if (metrica === '') {
                    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } };
                    row.height = 8;
                } else if (rowNumber % 2 === 0) {
                    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorAlterno } };
                }
                row.border = { bottom: { style: 'thin', color: { argb: colorBordes } } };
            }
        }
    });

    const estadisticasSheet = workbook.addWorksheet('Estadisticas');

    const ventasPorDia = {};
    ventasFiltradas.forEach(v => {
        const dia = new Date(v.fecha).getDate();
        if (!ventasPorDia[dia]) ventasPorDia[dia] = { normal: 0, upgrade: 0, propina: 0 };
        if (v.tipoVenta === 'upgrade') ventasPorDia[dia].upgrade++;
        else if (v.tipoVenta === 'propina') ventasPorDia[dia].propina++;
        else ventasPorDia[dia].normal++;
    });

    const ventasAdsPorDia = {};
    const ventasDiscordPorDia = {};
    ventasAds.forEach(v => { const dia = new Date(v.fecha).getDate(); ventasAdsPorDia[dia] = (ventasAdsPorDia[dia] || 0) + 1; });
    ventasDiscord.forEach(v => { const dia = new Date(v.fecha).getDate(); ventasDiscordPorDia[dia] = (ventasDiscordPorDia[dia] || 0) + 1; });
    const allDias = new Set([...Object.keys(ventasAdsPorDia), ...Object.keys(ventasDiscordPorDia)]);
    const diasOrdenadosGrafico = Array.from(allDias).sort((a, b) => parseInt(a) - parseInt(b));

    let currentRow = 1;
    estadisticasSheet.getCell(`A${currentRow}`).value = 'REGISTROS POR DIA';
    estadisticasSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: colorTextoBlanco } };
    estadisticasSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    estadisticasSheet.mergeCells(`A${currentRow}:E${currentRow}`);
    currentRow++;
    estadisticasSheet.getCell(`A${currentRow}`).value = 'Dia';
    estadisticasSheet.getCell(`B${currentRow}`).value = 'Normales';
    estadisticasSheet.getCell(`C${currentRow}`).value = 'Upgrades';
    estadisticasSheet.getCell(`D${currentRow}`).value = 'Propinas';
    estadisticasSheet.getCell(`E${currentRow}`).value = 'Total';
    estadisticasSheet.getRow(currentRow).font = { bold: true };
    currentRow++;
    Object.keys(ventasPorDia).sort((a, b) => a - b).forEach(dia => {
        const total = ventasPorDia[dia].normal + ventasPorDia[dia].upgrade + ventasPorDia[dia].propina;
        estadisticasSheet.getCell(`A${currentRow}`).value = `Dia ${dia}`;
        estadisticasSheet.getCell(`B${currentRow}`).value = ventasPorDia[dia].normal;
        estadisticasSheet.getCell(`C${currentRow}`).value = ventasPorDia[dia].upgrade;
        estadisticasSheet.getCell(`D${currentRow}`).value = ventasPorDia[dia].propina;
        estadisticasSheet.getCell(`E${currentRow}`).value = total;
        currentRow++;
    });
    currentRow += 2;

    const chartSheet = workbook.addWorksheet('Grafico Ads vs Discord');
    chartSheet.getCell('A1').value = 'GRÁFICO: VENTAS ADS VS DISCORD';
    chartSheet.getCell('A1').font = { bold: true, size: 14, color: { argb: colorTextoBlanco } };
    chartSheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    chartSheet.mergeCells('A1:F1');
    chartSheet.getRow(1).height = 28;
    let chartRow = 3;
    chartSheet.getCell(`A${chartRow}`).value = 'Día';
    chartSheet.getCell(`B${chartRow}`).value = 'Ads';
    chartSheet.getCell(`C${chartRow}`).value = 'Discord';
    chartSheet.getRow(chartRow).font = { bold: true };
    chartRow++;
    diasOrdenadosGrafico.forEach(dia => {
        chartSheet.getCell(`A${chartRow}`).value = parseInt(dia);
        chartSheet.getCell(`B${chartRow}`).value = ventasAdsPorDia[dia] || 0;
        chartSheet.getCell(`C${chartRow}`).value = ventasDiscordPorDia[dia] || 0;
        chartRow++;
    });

    const width = 800;
    const height = 450;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });
    const configuration = {
        type: 'line',
        data: {
            labels: diasOrdenadosGrafico.map(d => `Día ${d}`),
            datasets: [
                { label: 'Ads', data: diasOrdenadosGrafico.map(d => ventasAdsPorDia[d] || 0), borderColor: '#FF6B6B', backgroundColor: 'rgba(255, 107, 107, 0.1)', borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#FF6B6B', pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.4 },
                { label: 'Discord', data: diasOrdenadosGrafico.map(d => ventasDiscordPorDia[d] || 0), borderColor: '#5865F2', backgroundColor: 'rgba(88, 101, 242, 0.1)', borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#5865F2', pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.4 }
            ]
        },
        options: {
            responsive: false,
            plugins: {
                title: { display: true, text: 'Evolución de Ventas por Día: Ads vs Discord', font: { size: 18, weight: 'bold' }, padding: { top: 10, bottom: 20 } },
                legend: { display: true, position: 'bottom', labels: { font: { size: 14 }, padding: 15, usePointStyle: true } }
            },
            scales: {
                x: { title: { display: true, text: 'Día del Mes', font: { size: 14, weight: 'bold' } }, grid: { display: true, color: 'rgba(0, 0, 0, 0.05)' } },
                y: { title: { display: true, text: 'Cantidad de Ventas', font: { size: 14, weight: 'bold' } }, beginAtZero: true, ticks: { stepSize: 1 }, grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' } }
            }
        }
    };
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    const imageId = workbook.addImage({ buffer: imageBuffer, extension: 'png' });
    chartSheet.addImage(imageId, { tl: { col: 0, row: 1 }, ext: { width: 800, height: 450 } });
    chartSheet.getColumn(1).width = 15;
    chartSheet.getColumn(2).width = 15;
    chartSheet.getColumn(3).width = 15;

    estadisticasSheet.getCell(`A${currentRow}`).value = 'PRODUCTOS MAS VENDIDOS';
    estadisticasSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: colorTextoBlanco } };
    estadisticasSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    estadisticasSheet.mergeCells(`A${currentRow}:B${currentRow}`);
    currentRow++;
    estadisticasSheet.getCell(`A${currentRow}`).value = 'Producto';
    estadisticasSheet.getCell(`B${currentRow}`).value = 'Cantidad';
    estadisticasSheet.getRow(currentRow).font = { bold: true };
    currentRow++;
    Object.entries(ventasPorProducto).sort((a, b) => b[1] - a[1]).forEach(([producto, cantidad]) => {
        estadisticasSheet.getCell(`A${currentRow}`).value = producto;
        estadisticasSheet.getCell(`B${currentRow}`).value = cantidad;
        currentRow++;
    });
    currentRow += 2;

    estadisticasSheet.getCell(`A${currentRow}`).value = 'RANKING VENDEDORES - INGRESOS TOTALES';
    estadisticasSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: colorTextoBlanco } };
    estadisticasSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    estadisticasSheet.mergeCells(`A${currentRow}:C${currentRow}`);
    currentRow++;
    estadisticasSheet.getCell(`A${currentRow}`).value = 'Posición';
    estadisticasSheet.getCell(`B${currentRow}`).value = 'Vendedor';
    estadisticasSheet.getCell(`C${currentRow}`).value = 'Ingresos Totales';
    estadisticasSheet.getRow(currentRow).font = { bold: true };
    currentRow++;
    Object.entries(ventasPorVendedor).sort((a, b) => b[1].ingresos - a[1].ingresos).forEach(([vendedor, stats], index) => {
        estadisticasSheet.getCell(`A${currentRow}`).value = `#${index + 1}`;
        estadisticasSheet.getCell(`B${currentRow}`).value = vendedor;
        estadisticasSheet.getCell(`C${currentRow}`).value = `S/ ${stats.ingresos.toFixed(2)}`;
        currentRow++;
    });
    currentRow += 2;

    const comisionesPorVendedor = {};
    ventasFiltradas.forEach(v => {
        if (!comisionesPorVendedor[v.vendedor]) {
            comisionesPorVendedor[v.vendedor] = {
                comisionVenta: 0,
                comisionUpgrade: 0,
                comisionSoporte: 0,
                propinas: 0,
                totalComision: 0
            };
        }
        if (v.tipoVenta === 'propina') {
            comisionesPorVendedor[v.vendedor].propinas += parseFloat(v.precioRealSoles) || 0;
            return;
        }
        if (v.tipoVenta === 'upgrade') {
            comisionesPorVendedor[v.vendedor].comisionUpgrade += v.comisionVendedor || 0;
        } else {
            comisionesPorVendedor[v.vendedor].comisionVenta += v.comisionVenta || 0;
        }
        if (v.vendedorSoporte && v.vendedorSoporte !== v.vendedor && v.tipoVenta !== 'upgrade') {
            if (!comisionesPorVendedor[v.vendedorSoporte]) {
                comisionesPorVendedor[v.vendedorSoporte] = { comisionVenta: 0, comisionUpgrade: 0, comisionSoporte: 0, propinas: 0, totalComision: 0 };
            }
            comisionesPorVendedor[v.vendedorSoporte].comisionSoporte += v.comisionSoporte || 0;
        } else if (v.tipoVenta !== 'upgrade') {
            comisionesPorVendedor[v.vendedor].comisionSoporte += v.comisionSoporte || 0;
        }
    });
    Object.keys(comisionesPorVendedor).forEach(vendedor => {
        const c = comisionesPorVendedor[vendedor];
        c.totalComision = c.comisionVenta + c.comisionUpgrade + c.comisionSoporte + c.propinas; // SUMA PROPINAS
    });
    // ============================================================

    estadisticasSheet.getCell(`A${currentRow}`).value = 'RANKING VENDEDORES - COMISIONES';
    estadisticasSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: colorTextoBlanco } };
    estadisticasSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    estadisticasSheet.mergeCells(`A${currentRow}:C${currentRow}`);
    currentRow++;
    estadisticasSheet.getCell(`A${currentRow}`).value = 'Posición';
    estadisticasSheet.getCell(`B${currentRow}`).value = 'Vendedor';
    estadisticasSheet.getCell(`C${currentRow}`).value = 'Total Comisiones';
    estadisticasSheet.getRow(currentRow).font = { bold: true };
    currentRow++;
    Object.entries(comisionesPorVendedor).sort((a, b) => b[1].totalComision - a[1].totalComision).forEach(([vendedor, stats], index) => {
        estadisticasSheet.getCell(`A${currentRow}`).value = `#${index + 1}`;
        estadisticasSheet.getCell(`B${currentRow}`).value = vendedor;
        estadisticasSheet.getCell(`C${currentRow}`).value = `S/ ${stats.totalComision.toFixed(2)}`;
        currentRow++;
    });
    currentRow += 2;

    estadisticasSheet.getCell(`A${currentRow}`).value = 'TOP VENDEDORES';
    estadisticasSheet.getCell(`A${currentRow}`).font = { bold: true, size: 12, color: { argb: colorTextoBlanco } };
    estadisticasSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    estadisticasSheet.mergeCells(`A${currentRow}:F${currentRow}`);
    currentRow++;
    estadisticasSheet.getCell(`A${currentRow}`).value = 'Vendedor';
    estadisticasSheet.getCell(`B${currentRow}`).value = 'Total';
    estadisticasSheet.getCell(`C${currentRow}`).value = 'Normales';
    estadisticasSheet.getCell(`D${currentRow}`).value = 'Upgrades';
    estadisticasSheet.getCell(`E${currentRow}`).value = 'Propinas';
    estadisticasSheet.getCell(`F${currentRow}`).value = 'Ingresos';
    estadisticasSheet.getRow(currentRow).font = { bold: true };
    currentRow++;
    Object.entries(ventasPorVendedor).sort((a, b) => b[1].ventas - a[1].ventas).forEach(([vendedor, stats]) => {
        estadisticasSheet.getCell(`A${currentRow}`).value = vendedor;
        estadisticasSheet.getCell(`B${currentRow}`).value = stats.ventas;
        estadisticasSheet.getCell(`C${currentRow}`).value = stats.ventasNormales;
        estadisticasSheet.getCell(`D${currentRow}`).value = stats.upgrades;
        estadisticasSheet.getCell(`E${currentRow}`).value = stats.propinas;
        estadisticasSheet.getCell(`F${currentRow}`).value = `S/ ${stats.ingresos.toFixed(2)}`;
        currentRow++;
    });
    estadisticasSheet.columns = [
        { key: 'col1', width: 25 }, { key: 'col2', width: 12 }, { key: 'col3', width: 18 },
        { key: 'col4', width: 12 }, { key: 'col5', width: 12 }, { key: 'col6', width: 15 }
    ];

    const ventasTotalesSheet = workbook.addWorksheet('Ventas Totales');
    ventasTotalesSheet.columns = [
        { header: '#', key: 'numero', width: 6 }, { header: 'Fecha', key: 'fecha', width: 16 },
        { header: 'Vendedor', key: 'vendedor', width: 18 }, { header: 'Cliente', key: 'usuario', width: 16 },
        { header: 'WhatsApp', key: 'whatsapp', width: 16 }, { header: 'Metodo Pago', key: 'metodoPago', width: 16 },
        { header: 'Producto', key: 'producto', width: 18 }, { header: 'Periodo', key: 'periodo', width: 12 },
        { header: 'Precio Estandar', key: 'precioEstandar', width: 14 }, { header: 'Cliente Envio', key: 'clienteEnvio', width: 14 },
        { header: 'Moneda', key: 'moneda', width: 8 }, { header: 'Comision Pago', key: 'comisionPago', width: 12 },
        { header: 'Neto Recibido', key: 'netoRecibido', width: 14 }, { header: 'Equiv. Soles', key: 'precioSoles', width: 12 },
        { header: 'Tipo Ajuste', key: 'tipoAjuste', width: 12 }, { header: 'Descuento', key: 'descuento', width: 11 },
        { header: 'Propina', key: 'propina', width: 11 }, { header: 'Com. Venta', key: 'comisionVenta', width: 12 },
        { header: 'Com. Soporte', key: 'comisionSoporte', width: 12 }, { header: 'Soporte', key: 'vendedorSoporte', width: 16 },
        { header: 'Tipo Venta', key: 'tipoVenta', width: 12 }, { header: 'Nota', key: 'nota', width: 25 },
        { header: 'Licencia', key: 'licencia', width: 22 }
    ];
    ventasFiltradas.forEach((venta, index) => {
        let tipoAjusteTexto = '-', tipoVentaTexto = '';
        if (venta.tipoVenta === 'upgrade') {
            tipoAjusteTexto = '🔄 Upgrade';
            tipoVentaTexto = 'Upgrade';
        } else if (venta.tipoVenta === 'propina') {
            tipoAjusteTexto = '🎁 Propina Directa';
            tipoVentaTexto = 'Propina';
        } else {
            tipoAjusteTexto = venta.tipoAjuste === 'descuento' ? 'Descuento' : venta.tipoAjuste === 'propina' ? 'Propina Extra' : 'Normal';
            tipoVentaTexto = venta.tipoVenta === 'ads' ? '📢 Ads' : venta.tipoVenta === 'discord' ? '💬 Discord' : 'No especificado';
        }
        ventasTotalesSheet.addRow({
            numero: index + 1,
            fecha: new Date(venta.fecha).toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }),
            vendedor: venta.vendedor, usuario: venta.usuario || '-', whatsapp: venta.whatsapp || 'No proporcionado',
            metodoPago: venta.metodoPago,
            producto: venta.producto || (venta.productoNuevo ? `${venta.productoOriginal} → ${venta.productoNuevo}` : '-'),
            periodo: venta.periodo || (venta.periodoNuevo ? `${venta.periodoOriginal} → ${venta.periodoNuevo}` : '-'),
            precioEstandar: parseFloat(venta.precioEstandar || venta.precioNuevo || 0),
            clienteEnvio: venta.montoBrutoCliente ? parseFloat(venta.montoBrutoCliente) : null,
            moneda: venta.monedaOriginal || 'PEN',
            comisionPago: venta.comisionMetodoPago ? parseFloat(venta.comisionMetodoPago) : 0,
            netoRecibido: venta.montoNetoRecibido ? parseFloat(venta.montoNetoRecibido) : null,
            precioSoles: parseFloat(venta.precioRealSoles || venta.montoNetoSoles || venta.precioEstandar || 0),
            tipoAjuste: tipoAjusteTexto,
            descuento: venta.descuento ? parseFloat(venta.descuento) : null,
            propina: venta.propina ? parseFloat(venta.propina) : null,
            comisionVenta: parseFloat(venta.comisionVenta || venta.comisionVendedor || 0),
            comisionSoporte: parseFloat(venta.comisionSoporte || 0),
            vendedorSoporte: venta.vendedorSoporte || 'N/A', tipoVenta: tipoVentaTexto,
            nota: venta.nota || '', licencia: venta.licencia || 'N/A'
        });
    });
    const headerRowTotales = ventasTotalesSheet.getRow(1);
    headerRowTotales.font = { bold: true, size: 11, color: { argb: colorTextoBlanco } };
    headerRowTotales.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    headerRowTotales.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRowTotales.height = 24;
    ventasTotalesSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.font = { size: 10, color: { argb: colorTextoNegro } };
            row.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            row.height = 20;
            if (rowNumber % 2 === 0) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorAlterno } };
            row.border = { bottom: { style: 'thin', color: { argb: colorBordes } } };
        }
    });

    const ventasDiscordSheet = workbook.addWorksheet('Ventas Discord');
    ventasDiscordSheet.columns = [
        { header: '#', key: 'numero', width: 6 }, { header: 'Fecha', key: 'fecha', width: 16 },
        { header: 'Vendedor', key: 'vendedor', width: 18 }, { header: 'WhatsApp', key: 'whatsapp', width: 16 },
        { header: 'Metodo Pago', key: 'metodoPago', width: 16 }, { header: 'Producto', key: 'producto', width: 18 },
        { header: 'Periodo', key: 'periodo', width: 12 }, { header: 'Cliente Envio', key: 'clienteEnvio', width: 14 },
        { header: 'Moneda', key: 'moneda', width: 8 }, { header: 'Equiv. Soles', key: 'precioSoles', width: 12 },
        { header: 'Com. Venta', key: 'comisionVenta', width: 12 }, { header: 'Com. Soporte', key: 'comisionSoporte', width: 12 },
        { header: 'Soporte', key: 'vendedorSoporte', width: 16 }, { header: 'Licencia', key: 'licencia', width: 22 }
    ];
    ventasDiscord.forEach((venta, index) => {
        ventasDiscordSheet.addRow({
            numero: index + 1, fecha: new Date(venta.fecha).toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }),
            vendedor: venta.vendedor, whatsapp: venta.whatsapp || 'No proporcionado', metodoPago: venta.metodoPago,
            producto: venta.producto, periodo: venta.periodo,
            clienteEnvio: venta.montoBrutoCliente ? parseFloat(venta.montoBrutoCliente) : null,
            moneda: venta.monedaOriginal || 'PEN', precioSoles: parseFloat(venta.precioRealSoles || venta.precioEstandar || 0),
            comisionVenta: parseFloat(venta.comisionVenta || 0), comisionSoporte: parseFloat(venta.comisionSoporte || 0),
            vendedorSoporte: venta.vendedorSoporte || 'N/A', licencia: venta.licencia || 'N/A'
        });
    });
    const headerRowDiscord = ventasDiscordSheet.getRow(1);
    headerRowDiscord.font = { bold: true, size: 11, color: { argb: colorTextoBlanco } };
    headerRowDiscord.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorDiscord } };
    headerRowDiscord.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRowDiscord.height = 24;
    ventasDiscordSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.font = { size: 10, color: { argb: colorTextoNegro } };
            row.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            row.height = 20;
            if (rowNumber % 2 === 0) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F4FD' } };
            row.border = { bottom: { style: 'thin', color: { argb: colorBordes } } };
        }
    });

    const ventasAdsSheet = workbook.addWorksheet('Ventas Ads');
    ventasAdsSheet.columns = [
        { header: '#', key: 'numero', width: 6 }, { header: 'Fecha', key: 'fecha', width: 16 },
        { header: 'Vendedor', key: 'vendedor', width: 18 }, { header: 'WhatsApp', key: 'whatsapp', width: 16 },
        { header: 'Metodo Pago', key: 'metodoPago', width: 16 }, { header: 'Producto', key: 'producto', width: 18 },
        { header: 'Periodo', key: 'periodo', width: 12 }, { header: 'Cliente Envio', key: 'clienteEnvio', width: 14 },
        { header: 'Moneda', key: 'moneda', width: 8 }, { header: 'Equiv. Soles', key: 'precioSoles', width: 12 },
        { header: 'Com. Venta (-15%)', key: 'comisionVenta', width: 14 }, { header: 'Com. Soporte', key: 'comisionSoporte', width: 12 },
        { header: 'Soporte', key: 'vendedorSoporte', width: 16 }, { header: 'Licencia', key: 'licencia', width: 22 }
    ];
    ventasAds.forEach((venta, index) => {
        ventasAdsSheet.addRow({
            numero: index + 1, fecha: new Date(venta.fecha).toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }),
            vendedor: venta.vendedor, whatsapp: venta.whatsapp || 'No proporcionado', metodoPago: venta.metodoPago,
            producto: venta.producto, periodo: venta.periodo,
            clienteEnvio: venta.montoBrutoCliente ? parseFloat(venta.montoBrutoCliente) : null,
            moneda: venta.monedaOriginal || 'PEN', precioSoles: parseFloat(venta.precioRealSoles || venta.precioEstandar || 0),
            comisionVenta: parseFloat(venta.comisionVenta || 0), comisionSoporte: parseFloat(venta.comisionSoporte || 0),
            vendedorSoporte: venta.vendedorSoporte || 'N/A', licencia: venta.licencia || 'N/A'
        });
    });
    const headerRowAds = ventasAdsSheet.getRow(1);
    headerRowAds.font = { bold: true, size: 11, color: { argb: colorTextoBlanco } };
    headerRowAds.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorAds } };
    headerRowAds.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRowAds.height = 24;
    ventasAdsSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.font = { size: 10, color: { argb: colorTextoNegro } };
            row.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            row.height = 20;
            if (rowNumber % 2 === 0) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEAEA' } };
            row.border = { bottom: { style: 'thin', color: { argb: colorBordes } } };
        }
    });

    const upgradesSheet = workbook.addWorksheet('Upgrades');
    upgradesSheet.columns = [
        { header: '#', key: 'numero', width: 6 }, { header: 'Fecha', key: 'fecha', width: 16 },
        { header: 'Vendedor', key: 'vendedor', width: 18 }, { header: 'Cliente', key: 'usuario', width: 16 },
        { header: 'Venta Orig.', key: 'ventaOriginal', width: 10 }, { header: 'Plan Original', key: 'planOriginal', width: 20 },
        { header: 'Precio Orig.', key: 'precioOriginal', width: 12 }, { header: 'Plan Nuevo', key: 'planNuevo', width: 20 },
        { header: 'Precio Nuevo', key: 'precioNuevo', width: 12 }, { header: 'Diferencia', key: 'diferencia', width: 12 },
        { header: 'Cobrado', key: 'cobrado', width: 12 }, { header: 'Moneda', key: 'moneda', width: 8 },
        { header: 'Metodo Pago', key: 'metodoPago', width: 16 }, { header: 'Neto Soles', key: 'netoSoles', width: 12 },
        { header: 'Com. 30%', key: 'comision', width: 12 }, { header: 'Tipo Venta', key: 'tipoVenta', width: 12 },
        { header: 'Nota', key: 'nota', width: 25 }
    ];
    ventasUpgrade.forEach((upgrade, index) => {
        const tipoVentaTexto = upgrade.tipoVenta === 'ads' ? 'Ads' : upgrade.tipoVenta === 'discord' ? 'Discord' : 'No especificado';
        upgradesSheet.addRow({
            numero: index + 1,
            fecha: new Date(upgrade.fecha).toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }),
            vendedor: upgrade.vendedor, usuario: upgrade.usuario,
            ventaOriginal: `#${upgrade.ventaOriginalId}`,
            planOriginal: `${upgrade.productoOriginal} ${upgrade.periodoOriginal}`,
            precioOriginal: parseFloat(upgrade.precioOriginal || 0),
            planNuevo: `${upgrade.productoNuevo} ${upgrade.periodoNuevo}`,
            precioNuevo: parseFloat(upgrade.precioNuevo || 0),
            diferencia: parseFloat(upgrade.diferenciaEsperada || 0),
            cobrado: parseFloat(upgrade.montoCobrado || 0),
            moneda: upgrade.monedaOriginal || 'PEN', metodoPago: upgrade.metodoPago,
            netoSoles: parseFloat(upgrade.montoNetoSoles || 0),
            comision: parseFloat(upgrade.comisionVendedor || 0),
            tipoVenta: tipoVentaTexto, nota: upgrade.nota || ''
        });
    });
    const headerRowUpgrade = upgradesSheet.getRow(1);
    headerRowUpgrade.font = { bold: true, size: 11, color: { argb: colorTextoNegro } };
    headerRowUpgrade.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorUpgrade } };
    headerRowUpgrade.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRowUpgrade.height = 24;
    upgradesSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.font = { size: 10, color: { argb: colorTextoNegro } };
            row.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            row.height = 20;
            if (rowNumber % 2 === 0) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF8DC' } };
            row.border = { bottom: { style: 'thin', color: { argb: colorBordes } } };
        }
    });

    const propinasSheet = workbook.addWorksheet('Propinas');
    propinasSheet.columns = [
        { header: '#', key: 'numero', width: 6 }, { header: 'Fecha', key: 'fecha', width: 16 },
        { header: 'Vendedor', key: 'vendedor', width: 18 }, { header: 'Monto Bruto', key: 'montoBruto', width: 14 },
        { header: 'Moneda', key: 'moneda', width: 8 }, { header: 'Metodo Pago', key: 'metodoPago', width: 16 },
        { header: 'Descuento Metodo', key: 'descuentoMetodo', width: 14 }, { header: 'Neto Recibido', key: 'netoRecibido', width: 14 },
        { header: 'Neto en Soles', key: 'netoSoles', width: 14 }, { header: 'Tipo Venta', key: 'tipoVenta', width: 12 },
        { header: 'Nota', key: 'nota', width: 30 }
    ];
    propinas.forEach((propina, index) => {
        const tipoVentaTexto = propina.tipoVenta === 'ads' ? 'Ads' : propina.tipoVenta === 'discord' ? 'Discord' : 'No especificado';
        propinasSheet.addRow({
            numero: index + 1,
            fecha: new Date(propina.fecha).toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }),
            vendedor: propina.vendedor, montoBruto: parseFloat(propina.montoBrutoCliente || 0),
            moneda: propina.monedaOriginal || 'PEN', metodoPago: propina.metodoPago,
            descuentoMetodo: parseFloat(propina.comisionMetodoPago || 0),
            netoRecibido: parseFloat(propina.montoNetoRecibido || 0),
            netoSoles: parseFloat(propina.precioRealSoles || 0),
            tipoVenta: tipoVentaTexto, nota: propina.nota || ''
        });
    });
    const headerRowPropina = propinasSheet.getRow(1);
    headerRowPropina.font = { bold: true, size: 11, color: { argb: colorTextoNegro } };
    headerRowPropina.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPropina } };
    headerRowPropina.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRowPropina.height = 24;
    propinasSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.font = { size: 10, color: { argb: colorTextoNegro } };
            row.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            row.height = 20;
            if (rowNumber % 2 === 0) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FFF0' } };
            row.border = { bottom: { style: 'thin', color: { argb: colorBordes } } };
        }
    });

    const comisionesSheet = workbook.addWorksheet('Comisiones');
    comisionesSheet.columns = [
        { header: 'Vendedor', key: 'vendedor', width: 28 },
        { header: 'Ventas', key: 'totalVentas', width: 10 },
        { header: 'Upgrades', key: 'totalUpgrades', width: 10 },
        { header: 'Com. Ventas', key: 'comisionVenta', width: 14 },
        { header: 'Com. Upgrades', key: 'comisionUpgrade', width: 14 },
        { header: 'Com. Soporte', key: 'comisionSoporte', width: 14 },
        { header: 'Propinas', key: 'propinas', width: 14 },
        { header: 'TOTAL A PAGAR', key: 'total', width: 16 }
    ];

    const vendedoresOrdenadosComisiones = Object.entries(comisionesPorVendedor)
        .sort((a, b) => {
            const totalA = a[1].comisionVenta + a[1].comisionUpgrade + a[1].comisionSoporte + a[1].propinas;
            const totalB = b[1].comisionVenta + b[1].comisionUpgrade + b[1].comisionSoporte + b[1].propinas;
            return totalB - totalA;
        });

    let totalGeneralPago = 0;
    vendedoresOrdenadosComisiones.forEach(([vendedor, stats]) => {
        const total = stats.comisionVenta + stats.comisionUpgrade + stats.comisionSoporte + stats.propinas;
        totalGeneralPago += total;
        const ventasCount = ventasPorVendedor[vendedor]?.ventasNormales || 0;
        const upgradesCount = ventasPorVendedor[vendedor]?.upgrades || 0;
        comisionesSheet.addRow({
            vendedor,
            totalVentas: ventasCount,
            totalUpgrades: upgradesCount,
            comisionVenta: `S/ ${stats.comisionVenta.toFixed(2)}`,
            comisionUpgrade: `S/ ${stats.comisionUpgrade.toFixed(2)}`,
            comisionSoporte: `S/ ${stats.comisionSoporte.toFixed(2)}`,
            propinas: `S/ ${stats.propinas.toFixed(2)}`,            // NUEVO
            total: `S/ ${total.toFixed(2)}`
        });
    });

    const rowSeparador = comisionesSheet.addRow({ vendedor: '', totalVentas: '', totalUpgrades: '', comisionVenta: '', comisionUpgrade: '', comisionSoporte: '', propinas: '', total: '' });
    rowSeparador.border = { top: { style: 'medium', color: { argb: colorPrincipal } } };

    const rowTotal = comisionesSheet.addRow({
        vendedor: 'TOTAL GENERAL',
        totalVentas: totalVentasNormales,
        totalUpgrades: totalUpgrades,
        comisionVenta: `S/ ${comisionVentaNormal.toFixed(2)}`,
        comisionUpgrade: `S/ ${comisionVentaUpgrade.toFixed(2)}`,
        comisionSoporte: `S/ ${comisionSoporteTotal.toFixed(2)}`,
        propinas: `S/ ${ingresosPropinas.toFixed(2)}`,
        total: `S/ ${totalGeneralPago.toFixed(2)}`
    });
    rowTotal.font = { bold: true, size: 12, color: { argb: colorTextoBlanco } };
    rowTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    rowTotal.alignment = { horizontal: 'center', vertical: 'middle' };
    rowTotal.height = 26;
    // ============================================================

    const headerRowComisiones = comisionesSheet.getRow(1);
    headerRowComisiones.font = { bold: true, size: 11, color: { argb: colorTextoBlanco } };
    headerRowComisiones.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorPrincipal } };
    headerRowComisiones.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    headerRowComisiones.height = 24;
    comisionesSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1 && rowNumber < comisionesSheet.rowCount) {
            row.font = { size: 10, color: { argb: colorTextoNegro } };
            row.alignment = { horizontal: 'left', vertical: 'middle' };
            row.height = 22;
            if (rowNumber % 2 === 0) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorAlterno } };
            row.border = { bottom: { style: 'thin', color: { argb: colorBordes } } };
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

module.exports = { generateSalesExcel };