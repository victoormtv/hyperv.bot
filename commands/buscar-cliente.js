const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { roles } = require("../data/ids");
const config = require("../data/config");

const salesFilePath = path.join(__dirname, "../data/sales.json");

const DIAS_POR_PERIODO = {
    "1 dia": 1, Semanal: 7, "14 dias": 14, "15 dias": 15,
    Mensual: 30, "60 dias": 60, Trimestral: 90, Anual: 365,
    "Por Temporada": 90, Permanente: 3650,
};

function calcularFechaVencimiento(fechaVenta, periodo) {
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buscar-cliente")
        .setDescription("Ver historial de compras de un cliente")
        .addStringOption((option) =>
            option
                .setName("busqueda")
                .setDescription("WhatsApp o @usuario de Discord")
                .setRequired(true),
        ),

    async execute(interaction) {
        const adminRoles = [roles.ADMIN, roles.VENDOR].flat().filter(Boolean);
        const esAdmin = adminRoles.some((r) => interaction.member.roles.cache.has(r));

        if (!esAdmin) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ Solo los **Admins** y **Vendors** pueden usar este comando.")
                        .setColor("#ff0000"),
                ],
                ephemeral: true,
            });
        }

        if (interaction.channelId !== "1540795132020920390") {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ Este comando solo puede usarse en el canal de ventas.")
                        .setColor("#ff0000"),
                ],
                ephemeral: true,
            });
        }

        await interaction.deferReply({ ephemeral: true });

        const busqueda = interaction.options.getString("busqueda").trim();
        const sales = loadSales();

        // Detectar si es mención de Discord o WhatsApp
        const mentionMatch = busqueda.match(/^<@!?(\d+)>$/) || busqueda.match(/^(\d{17,19})$/);
        let ventasCliente;

        if (mentionMatch) {
            const userId = mentionMatch[1];
            ventasCliente = sales.filter((v) => v.vendedorId === userId || v.clienteId === userId);
        } else {
            ventasCliente = sales.filter((v) =>
                v.whatsapp && v.whatsapp.replace(/\s/g, "").includes(busqueda.replace(/\s/g, "")),
            );
        }

        if (ventasCliente.length === 0) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`📭 No se encontraron compras para **${busqueda}**.`)
                        .setColor(config.embedColor),
                ],
            });
        }

        const ahora = new Date();

        // Ordenar por fecha más reciente
        ventasCliente.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Mostrar máximo 10 últimas compras
        const ultimas = ventasCliente.slice(0, 10);

        const historialTexto = ultimas.map((v) => {
            const vencimiento = calcularFechaVencimiento(v.fecha, v.periodo);
            const vencioStr = vencimiento
                ? vencimiento < ahora
                    ? `~~${vencimiento.toLocaleDateString("es-PE")}~~ (vencida)`
                    : vencimiento.toLocaleDateString("es-PE")
                : "—";

            return (
                `**#${v.numeroVenta.toString().padStart(3, "0")}** — ${v.producto} (${v.periodo})\n` +
                `Vence: ${vencioStr} | S/ ${v.precioRealSoles} | <@${v.vendedorId}>`
            );
        }).join("\n\n");

        const activas = ventasCliente.filter((v) => {
            const venc = calcularFechaVencimiento(v.fecha, v.periodo);
            return venc && venc > ahora;
        });

        const embed = new EmbedBuilder()
            .setTitle(`> Historial de cliente`)
            .setDescription(
                `**Búsqueda:** ${busqueda}\n` +
                `**Total compras:** ${ventasCliente.length} | **Activas:** ${activas.length}\n\n` +
                `${historialTexto}`,
            )
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};