const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const config = require('../data/config');
const ids = require('../data/ids');

const freePanelFilePath = path.join(__dirname, '../data/freepanel.json');

function loadFreePanelUsers() {
    if (!fs.existsSync(freePanelFilePath)) {
        return [];
    }
    const data = fs.readFileSync(freePanelFilePath, 'utf-8');
    return JSON.parse(data);
}

function filtrarDatos(datos, mes, semana) {
    return datos.filter(solicitud => {
        const fecha = new Date(solicitud.fechaSolicitud);

        if (mes !== 'todos') {
            const meses = {
                'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
                'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
                'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
            };
            if (fecha.getMonth() !== meses[mes.toLowerCase()]) {
                return false;
            }
        }

        if (semana !== 'todas') {
            const semanaDelMes = Math.ceil(fecha.getDate() / 7);
            const numSemana = parseInt(semana.replace('semana_', ''));
            if (semanaDelMes !== numSemana) {
                return false;
            }
        }

        return true;
    });
}

function formatearFecha(fecha) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
}

function formatearFechaCorta(fecha) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
}

async function generarGraficoLineal(datos) {
    const width = 800;
    const height = 400;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const solicitudesPorDia = {};
    datos.forEach(solicitud => {
        const fecha = new Date(solicitud.fechaSolicitud);
        const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
        if (!solicitudesPorDia[fechaStr]) {
            solicitudesPorDia[fechaStr] = 0;
        }
        solicitudesPorDia[fechaStr]++;
    });

    const fechasOrdenadas = Object.keys(solicitudesPorDia).sort();
    const valores = fechasOrdenadas.map(fecha => solicitudesPorDia[fecha]);

    const configuration = {
        type: 'line',
        data: {
            labels: fechasOrdenadas.map(f => formatearFechaCorta(f)),
            datasets: [{
                label: 'Solicitudes por día',
                data: valores,
                borderColor: '#013173',
                backgroundColor: 'rgba(1, 49, 115, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Solicitudes FREE Panel - Evolución Diaria',
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };

    return await chartJSNodeCanvas.renderToBuffer(configuration);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reportfree')
        .setDescription('Genera reporte estadístico de solicitudes FREE Panel')
        .addStringOption(option =>
            option.setName('mes')
                .setDescription('Mes a filtrar')
                .setRequired(true)
                .addChoices(
                    { name: 'Todos', value: 'todos' },
                    { name: 'Enero', value: 'enero' },
                    { name: 'Febrero', value: 'febrero' },
                    { name: 'Marzo', value: 'marzo' },
                    { name: 'Abril', value: 'abril' },
                    { name: 'Mayo', value: 'mayo' },
                    { name: 'Junio', value: 'junio' },
                    { name: 'Julio', value: 'julio' },
                    { name: 'Agosto', value: 'agosto' },
                    { name: 'Septiembre', value: 'septiembre' },
                    { name: 'Octubre', value: 'octubre' },
                    { name: 'Noviembre', value: 'noviembre' },
                    { name: 'Diciembre', value: 'diciembre' }
                ))
        .addStringOption(option =>
            option.setName('semana')
                .setDescription('Semana a filtrar')
                .setRequired(true)
                .addChoices(
                    { name: 'Todas', value: 'todas' },
                    { name: 'Semana 1', value: 'semana_1' },
                    { name: 'Semana 2', value: 'semana_2' },
                    { name: 'Semana 3', value: 'semana_3' },
                    { name: 'Semana 4', value: 'semana_4' }
                )
            ),

    async execute(interaction) {

        const adminRoles = ids.roles.ADMIN;
        const tienePermiso = interaction.member.roles.cache.some(role =>
            adminRoles.includes(role.id)
        );

        if (!tienePermiso) {
            const noPermisoEmbed = new EmbedBuilder()
                .setTitle('HyperV - Acceso Denegado')
                .setDescription(
                    'No tienes permisos para ejecutar este comando.\n' +
                    'Este comando es exclusivo para el staff.'
                )
                .setColor('#FF0000')
                .setFooter(config.embedFooter)
                .setTimestamp();

            return await interaction.reply({ embeds: [noPermisoEmbed], ephemeral: true });
        }

        await interaction.deferReply();

        const mes = interaction.options.getString('mes');
        const semana = interaction.options.getString('semana');

        const todosLosDatos = loadFreePanelUsers();
        const datosFiltrados = filtrarDatos(todosLosDatos, mes, semana);

        if (datosFiltrados.length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Sin datos')
                .setDescription('No hay solicitudes registradas para el período seleccionado.')
                .setColor(config.embedColor)
                .setFooter(config.embedFooter)
                .setTimestamp();

            return await interaction.editReply({ embeds: [errorEmbed] });
        }

        const totalSolicitudes = datosFiltrados.length;
        const aprobadas = datosFiltrados.filter(s => s.estado === 'aprobada').length;
        const rechazadas = datosFiltrados.filter(s => s.estado === 'rechazada').length;
        const pendientes = datosFiltrados.filter(s => s.estado === 'pendiente').length;

        const tierBasico = datosFiltrados.filter(s => s.tier === 'basico').length;
        const tierMedio = datosFiltrados.filter(s => s.tier === 'medio').length;
        const tierPremium = datosFiltrados.filter(s => s.tier === 'premium').length;

        const tasaConversion = totalSolicitudes > 0 ? ((aprobadas / totalSolicitudes) * 100).toFixed(2) : 0;
        const promedioDias = datosFiltrados.length > 0
            ? (datosFiltrados.reduce((sum, s) => sum + s.dias, 0) / datosFiltrados.length).toFixed(2)
            : 0;

        const workbook = new ExcelJS.Workbook();

        const dashboardSheet = workbook.addWorksheet('Dashboard');

        const headerStyle = {
            font: { bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF013173' } },
            alignment: { vertical: 'middle', horizontal: 'center' },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        const dataStyle = {
            alignment: { vertical: 'middle', horizontal: 'center' },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        dashboardSheet.mergeCells('A1:D1');
        dashboardSheet.getCell('A1').value = 'HyperV - Reporte FREE Panel';
        dashboardSheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF013173' } };
        dashboardSheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

        dashboardSheet.mergeCells('A2:D2');
        const periodoTexto = `Período: ${mes === 'todos' ? 'Todos los meses' : mes.charAt(0).toUpperCase() + mes.slice(1)} - ${semana === 'todas' ? 'Todas las semanas' : semana.replace('_', ' ').charAt(0).toUpperCase() + semana.slice(1).replace('_', ' ')}`;
        dashboardSheet.getCell('A2').value = periodoTexto;
        dashboardSheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

        dashboardSheet.getCell('A4').value = 'Estadística';
        dashboardSheet.getCell('A4').style = headerStyle;
        dashboardSheet.getCell('B4').value = 'Valor';
        dashboardSheet.getCell('B4').style = headerStyle;

        const estadisticas = [
            ['Total Solicitudes', totalSolicitudes],
            ['Aprobadas', aprobadas],
            ['Rechazadas', rechazadas],
            ['Pendientes', pendientes],
            ['Tasa de Conversión', `${tasaConversion}%`],
            ['Promedio Días Otorgados', promedioDias]
        ];

        estadisticas.forEach((stat, index) => {
            const row = 5 + index;
            dashboardSheet.getCell(`A${row}`).value = stat[0];
            dashboardSheet.getCell(`A${row}`).style = dataStyle;
            dashboardSheet.getCell(`B${row}`).value = stat[1];
            dashboardSheet.getCell(`B${row}`).style = dataStyle;
        });

        dashboardSheet.getCell('A12').value = 'Tier';
        dashboardSheet.getCell('A12').style = headerStyle;
        dashboardSheet.getCell('B12').value = 'Solicitudes';
        dashboardSheet.getCell('B12').style = headerStyle;
        dashboardSheet.getCell('C12').value = 'Porcentaje';
        dashboardSheet.getCell('C12').style = headerStyle;

        const distribuciones = [
            ['Básico (1 día)', tierBasico, `${totalSolicitudes > 0 ? ((tierBasico / totalSolicitudes) * 100).toFixed(2) : 0}%`],
            ['Medio (3 días)', tierMedio, `${totalSolicitudes > 0 ? ((tierMedio / totalSolicitudes) * 100).toFixed(2) : 0}%`],
            ['Premium (5 días)', tierPremium, `${totalSolicitudes > 0 ? ((tierPremium / totalSolicitudes) * 100).toFixed(2) : 0}%`]
        ];

        distribuciones.forEach((dist, index) => {
            const row = 13 + index;
            dashboardSheet.getCell(`A${row}`).value = dist[0];
            dashboardSheet.getCell(`A${row}`).style = dataStyle;
            dashboardSheet.getCell(`B${row}`).value = dist[1];
            dashboardSheet.getCell(`B${row}`).style = dataStyle;
            dashboardSheet.getCell(`C${row}`).value = dist[2];
            dashboardSheet.getCell(`C${row}`).style = dataStyle;
        });

        dashboardSheet.getColumn('A').width = 30;
        dashboardSheet.getColumn('B').width = 20;
        dashboardSheet.getColumn('C').width = 20;

        const graficoSheet = workbook.addWorksheet('Gráfico');
        const imageBuffer = await generarGraficoLineal(datosFiltrados);
        const imageId = workbook.addImage({
            buffer: imageBuffer,
            extension: 'png'
        });

        graficoSheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 800, height: 400 }
        });

        const registrosSheet = workbook.addWorksheet('Registros');

        const headers = ['#', 'Usuario Discord', 'Tier', 'Capturas', 'Estado', 'Licencia', 'Fecha Solicitud', 'Días'];
        headers.forEach((header, index) => {
            const cell = registrosSheet.getCell(1, index + 1);
            cell.value = header;
            cell.style = headerStyle;
        });

        datosFiltrados.forEach((solicitud, index) => {
            const row = index + 2;
            registrosSheet.getCell(row, 1).value = solicitud.solicitudId;
            registrosSheet.getCell(row, 2).value = solicitud.username;
            registrosSheet.getCell(row, 3).value = solicitud.tier.toUpperCase();
            registrosSheet.getCell(row, 4).value = solicitud.capturasUrls ? solicitud.capturasUrls.length : 0;
            registrosSheet.getCell(row, 5).value = solicitud.estado.toUpperCase();
            registrosSheet.getCell(row, 6).value = solicitud.licencia || 'N/A';
            registrosSheet.getCell(row, 7).value = formatearFecha(solicitud.fechaSolicitud);
            registrosSheet.getCell(row, 8).value = solicitud.dias;

            for (let col = 1; col <= 8; col++) {
                registrosSheet.getCell(row, col).style = dataStyle;
            }

            if (solicitud.estado === 'aprobada') {
                registrosSheet.getCell(row, 5).fill = {
                    type: 'pattern', pattern: 'solid',
                    fgColor: { argb: 'FF90EE90' }
                };
            } else if (solicitud.estado === 'rechazada') {
                registrosSheet.getCell(row, 5).fill = {
                    type: 'pattern', pattern: 'solid',
                    fgColor: { argb: 'FFFF6B6B' }
                };
            } else if (solicitud.estado === 'pendiente') {
                registrosSheet.getCell(row, 5).fill = {
                    type: 'pattern', pattern: 'solid',
                    fgColor: { argb: 'FFFFFF99' }
                };
            }
        });

        registrosSheet.getColumn(1).width = 8;
        registrosSheet.getColumn(2).width = 25;
        registrosSheet.getColumn(3).width = 15;
        registrosSheet.getColumn(4).width = 12;
        registrosSheet.getColumn(5).width = 15;
        registrosSheet.getColumn(6).width = 35;
        registrosSheet.getColumn(7).width = 20;
        registrosSheet.getColumn(8).width = 10;

        const ahora = new Date();
        const fechaReporte = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}_${String(ahora.getHours()).padStart(2, '0')}-${String(ahora.getMinutes()).padStart(2, '0')}-${String(ahora.getSeconds()).padStart(2, '0')}`;
        const fileName = `Reporte_FREE_${mes}_${semana}_${fechaReporte}.xlsx`;
        const filePath = path.join(__dirname, '../temp', fileName);

        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        await workbook.xlsx.writeFile(filePath);

        const attachment = new AttachmentBuilder(filePath, { name: fileName });

        const reportEmbed = new EmbedBuilder()
            .setTitle('Reporte FREE Panel Generado')
            .setDescription(
                `**Período:** ${periodoTexto}\n\n` +
                `**Total Solicitudes:** ${totalSolicitudes}\n` +
                `**Aprobadas:** ${aprobadas}\n` +
                `**Rechazadas:** ${rechazadas}\n` +
                `**Pendientes:** ${pendientes}\n` +
                `**Tasa de Conversión:** ${tasaConversion}%\n\n` +
                'El archivo Excel contiene:\n' +
                '- Dashboard con estadísticas\n' +
                '- Gráfico lineal de evolución\n' +
                '- Registros detallados'
            )
            .setColor(config.embedColor)
            .setThumbnail(config.embedThumbnail)
            .setFooter(config.embedFooter)
            .setTimestamp();

        await interaction.editReply({ embeds: [reportEmbed], files: [attachment] });

        setTimeout(() => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Archivo temporal eliminado: ${fileName}`);
            }
        }, 10000);
    }
};
