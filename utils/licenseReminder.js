// utils/licenseReminder.js
const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const config = require("../data/config");

const salesFilePath = path.join(__dirname, "../data/sales.json");

const DIAS_POR_PERIODO = {
    "1 dia": 1,
    Semanal: 7,
    "14 dias": 14,
    "15 dias": 15,
    Mensual: 30,
    "60 dias": 60,
    Trimestral: 90,
    Anual: 365,
    "Por Temporada": 90,
    Permanente: 3650,
};

function calcularFechaVencimiento(fechaVenta, periodo) {
    if (!periodo) return null;
    const periodoBase = periodo.split("+")[0].trim();
    const dias = DIAS_POR_PERIODO[periodoBase];
    if (!dias) return null;

    const fecha = new Date(fechaVenta);
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

function loadSales() {
    if (!fs.existsSync(salesFilePath)) return [];
    return JSON.parse(fs.readFileSync(salesFilePath, "utf-8"));
}

async function checkLicenseReminders(client) {
    const sales = loadSales();
    const ahora = new Date();
    const en3dias = new Date(ahora);
    en3dias.setDate(en3dias.getDate() + 3);

    const ventasPorRecordar = sales.filter((v) => {
        if (v.recordatorioEnviado) return false;
        if (v.tipoAjuste === "anulada") return false;

        const vencimiento = calcularFechaVencimiento(v.fecha, v.periodo);
        if (!vencimiento) return false;

        return vencimiento <= en3dias && vencimiento > ahora;
    });

    if (ventasPorRecordar.length === 0) return;

    for (const venta of ventasPorRecordar) {
        try {
            const vencimiento = calcularFechaVencimiento(venta.fecha, venta.periodo);
            const diasRestantes = Math.ceil((vencimiento - ahora) / (1000 * 60 * 60 * 24));

            const vendedor = await client.users.fetch(venta.vendedorId);
            const dm = await vendedor.createDM();

            const embed = new EmbedBuilder()
                .setTitle("> HyperV - Licencia por vencer")
                .setDescription(
                    `Tu cliente tiene una licencia por vencer en **${diasRestantes} día(s)**.\n\n` +
                    `**Venta #:** ${venta.numeroVenta.toString().padStart(3, "0")}\n` +
                    `**Producto:** ${venta.producto}\n` +
                    `**Período:** ${venta.periodo}\n` +
                    `**WhatsApp:** ${venta.whatsapp}\n` +
                    `**Fecha venta:** ${new Date(venta.fecha).toLocaleDateString("es-PE")}\n` +
                    `**Vence:** ${vencimiento.toLocaleDateString("es-PE")}\n\n` +
                    `Contacta al cliente para ofrecerle renovación.`,
                )
                .setColor("#ff8800")
                .setFooter(config.embedFooter)
                .setTimestamp();

            await dm.send({ embeds: [embed] });

            const salesUpdated = loadSales();
            const idx = salesUpdated.findIndex((v) => v.numeroVenta === venta.numeroVenta);
            if (idx !== -1) {
                salesUpdated[idx].recordatorioEnviado = true;
                salesUpdated[idx].fechaRecordatorio = new Date().toISOString();
                fs.writeFileSync(salesFilePath, JSON.stringify(salesUpdated, null, 2));
            }

            console.log(`⏳ Recordatorio DM enviado para venta #${venta.numeroVenta} → ${vendedor.tag}`);
        } catch (err) {
            console.error(`❌ Error enviando DM para venta #${venta.numeroVenta}:`, err);
        }
    }
}

module.exports = { checkLicenseReminders };