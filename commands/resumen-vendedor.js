const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { roles, channels } = require("../data/ids");
const config = require("../data/config");

const salesFilePath = path.join(__dirname, "../data/sales.json");
const ALERTA_DESCUENTO_CANAL = channels.LOGIN_VENTAS; // o pon un canal específico de alertas
const UMBRAL_DESCUENTO = 15; // % máximo de descuento antes de alertar

function loadSales() {
    if (!fs.existsSync(salesFilePath)) return [];
    return JSON.parse(fs.readFileSync(salesFilePath, "utf-8"));
}

function getPeriodoActual() {
    const ahora = new Date();
    const dia = ahora.getUTCDate() - 5 / 24; // UTC-5
    const mes = ahora.getUTCMonth();
    const anio = ahora.getUTCFullYear();

    // Quincena 1: días 1-15, Quincena 2: días 16-fin
    const inicioMes = new Date(Date.UTC(anio, mes, 1, 5, 0, 0));
    const inicioQ2 = new Date(Date.UTC(anio, mes, 16, 5, 0, 0));
    const finMes = new Date(Date.UTC(anio, mes + 1, 1, 5, 0, 0));

    return { inicioMes, inicioQ2, finMes, ahora: new Date() };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resumen-vendedor")
        .setDescription("Ver resumen de ventas de un vendedor en el período actual")
        .addUserOption((option) =>
            option
                .setName("vendedor")
                .setDescription("Vendedor a consultar")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("periodo")
                .setDescription("Período a consultar (default: quincena actual)")
                .setRequired(false)
                .addChoices(
                    { name: "Quincena actual", value: "quincena" },
                    { name: "Mes actual", value: "mes" },
                ),
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

        await interaction.deferReply({ ephemeral: false });

        const vendedor = interaction.options.getUser("vendedor");
        const periodoOpcion = interaction.options.getString("periodo") || "quincena";
        const sales = loadSales();
        const { inicioMes, inicioQ2, finMes, ahora } = getPeriodoActual();

        let inicio, fin, periodoLabel;

        if (periodoOpcion === "mes") {
            inicio = inicioMes;
            fin = finMes;
            periodoLabel = `Mes actual (${ahora.toLocaleString("es-PE", { month: "long", timeZone: "America/Lima" })})`;
        } else {
            if (ahora >= inicioQ2) {
                inicio = inicioQ2;
                fin = finMes;
                periodoLabel = "2da quincena";
            } else {
                inicio = inicioMes;
                fin = inicioQ2;
                periodoLabel = "1ra quincena";
            }
        }

        const ventasVendedor = sales.filter((v) => {
            const fecha = new Date(v.fecha);
            return v.vendedorId === vendedor.id && fecha >= inicio && fecha < fin;
        });

        if (ventasVendedor.length === 0) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`📭 <@${vendedor.id}> no tiene ventas registradas en este período (${periodoLabel}).`)
                        .setColor(config.embedColor),
                ],
            });
        }

        const totalVentas = ventasVendedor.length;
        const totalSoles = ventasVendedor.reduce((acc, v) => acc + (v.precioRealSoles || 0), 0);
        const totalComisionVenta = ventasVendedor.reduce((acc, v) => acc + (v.comisionVenta || 0), 0);
        const totalComisionSoporte = ventasVendedor.reduce((acc, v) => acc + (v.comisionSoporte || 0), 0);
        const totalDescuentos = ventasVendedor.filter((v) => v.tipoAjuste === "descuento").length;
        const totalPropinas = ventasVendedor.filter((v) => v.tipoAjuste === "propina").length;

        // Agrupar por producto
        const porProducto = {};
        ventasVendedor.forEach((v) => {
            if (!porProducto[v.producto]) porProducto[v.producto] = 0;
            porProducto[v.producto]++;
        });
        const productosTexto = Object.entries(porProducto)
            .sort((a, b) => b[1] - a[1])
            .map(([p, c]) => `${p}: **${c}**`)
            .join("\n");

        const embed = new EmbedBuilder()
            .setTitle(`> Resumen de ${vendedor.username}`)
            .setDescription(`**Período:** ${periodoLabel}\n**Vendedor:** <@${vendedor.id}>`)
            .addFields(
                { name: "Total ventas", value: `${totalVentas}`, inline: true },
                { name: "Total en soles", value: `S/ ${totalSoles.toFixed(2)}`, inline: true },
                { name: "Comisión venta", value: `S/ ${totalComisionVenta.toFixed(2)}`, inline: true },
                { name: "Comisión soporte", value: `S/ ${totalComisionSoporte.toFixed(2)}`, inline: true },
                { name: "Con descuento", value: `${totalDescuentos}`, inline: true },
                { name: "Con propina", value: `${totalPropinas}`, inline: true },
                { name: "Productos vendidos", value: productosTexto || "—", inline: false },
            )
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};