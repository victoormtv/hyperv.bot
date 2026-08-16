const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { roles } = require("../data/ids");
const config = require("../data/config");
const { generateSalesExcel } = require("../utils/excelHelper");
const fs = require("fs");
const path = require("path");

const salesFilePath = path.join(__dirname, "../data/sales.json");

function loadSales() {
  if (!fs.existsSync(salesFilePath)) {
    return [];
  }
  const data = fs.readFileSync(salesFilePath, "utf-8");
  return JSON.parse(data);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reporte-mensual")
    .setDescription("Generar reporte de ventas y propinas mensual en Excel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("mes")
        .setDescription("Mes a reportar (1-12)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(12),
    )
    .addIntegerOption((option) =>
      option
        .setName("año")
        .setDescription("Año del reporte")
        .setRequired(false)
        .setMinValue(2020)
        .setMaxValue(2030),
    ),

  async execute(interaction) {
    const userRoles = interaction.member.roles.cache;
    const isAdmin = roles.ADMIN.some((adminId) => userRoles.has(adminId));

    if (!isAdmin) {
      return await interaction.reply({
        content: "❌ Solo los admins pueden generar reportes.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const ventas = loadSales();
    const mes = interaction.options.getInteger("mes");
    const año =
      interaction.options.getInteger("año") || new Date().getFullYear();

    if (!ventas.length) {
      return await interaction.editReply({
        content: "❌ No hay ventas registradas aún.",
        ephemeral: true,
      });
    }

    // Calcular fechas del mes completo
    const OFFSET_HOURS = 5;
    const fechaInicio = new Date(
      Date.UTC(año, mes - 1, 1, OFFSET_HOURS, 0, 0, 0),
    );
    const fechaFin = new Date(
      Date.UTC(año, mes, 1, OFFSET_HOURS, 0, 0, 0) - 1,
    );

    let ventasFiltradas = ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
    });

    const nombresMeses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    ventas.slice(-10).forEach((v) => {
      const fv = new Date(v.fecha);
      const incluida = fv >= fechaInicio && fv <= fechaFin;
      const fechaLocal = new Date(fv.getTime() - OFFSET_HOURS * 3600000);
      console.log(
        `#${v.numeroVenta}: ${v.fecha} → Local: ${fechaLocal.toISOString().replace("Z", " UTC-5")} ${incluida ? "✅ INCLUIDA" : "❌ EXCLUIDA"}`,
      );
    });

    if (!ventasFiltradas.length) {
      return await interaction.editReply({
        content: `❌ No hay ventas para ${nombresMeses[mes - 1]} ${año}.`,
        ephemeral: true,
      });
    }

    try {
      const buffer = await generateSalesExcel(
        ventasFiltradas,
        mes,
        año,
        null,
        null,
        null,
      );

      if (!buffer) {
        return await interaction.editReply({
          content: "❌ Error al generar el archivo Excel.",
          ephemeral: true,
        });
      }

      const attachment = new AttachmentBuilder(buffer, {
        name: `reporte-ventas-mensual-${mes.toString().padStart(2, "0")}-${año}.xlsx`,
      });

      const ventasNormales = ventasFiltradas.filter(
        (v) => v.tipoVenta !== "upgrade" && v.tipoVenta !== "propina",
      );
      const ventasUpgrade = ventasFiltradas.filter(
        (v) => v.tipoVenta === "upgrade",
      );
      const propinas = ventasFiltradas.filter((v) => v.tipoVenta === "propina");

      const ventasAds = ventasFiltradas.filter(
        (v) => v.origen && v.origen.toLowerCase() === "ads",
      );
      const ventasDiscord = ventasFiltradas.filter(
        (v) => v.origen && v.origen.toLowerCase() === "discord",
      );

      const totalVentas = ventasFiltradas.length;
      const totalVentasNormales = ventasNormales.length;
      const totalUpgrades = ventasUpgrade.length;
      const totalPropinas = propinas.length;

      const ingresosNormales = ventasNormales.reduce(
        (sum, v) => sum + (v.precioRealSoles || v.precioEstandar || 0),
        0,
      );
      const ingresosUpgrades = ventasUpgrade.reduce(
        (sum, v) => sum + (v.montoNetoSoles || 0),
        0,
      );
      const ingresosPropinas = propinas.reduce(
        (sum, p) => sum + (p.precioRealSoles || 0),
        0,
      );
      const totalIngresos =
        ingresosNormales + ingresosUpgrades + ingresosPropinas;

      const ingresosAds = ventasAds.reduce((sum, v) => {
        if (v.tipoVenta === "upgrade") {
          return sum + (v.montoNetoSoles || 0);
        } else if (v.tipoVenta === "propina") {
          return sum + (v.precioRealSoles || 0);
        }
        return sum + (v.precioRealSoles || v.precioEstandar || 0);
      }, 0);

      const ingresosDiscord = ventasDiscord.reduce((sum, v) => {
        if (v.tipoVenta === "upgrade") {
          return sum + (v.montoNetoSoles || 0);
        } else if (v.tipoVenta === "propina") {
          return sum + (v.precioRealSoles || 0);
        }
        return sum + (v.precioRealSoles || v.precioEstandar || 0);
      }, 0);

      const comisionVentaNormal = ventasNormales.reduce(
        (sum, v) => sum + (v.comisionVenta || 0),
        0,
      );
      const comisionVentaUpgrade = ventasUpgrade.reduce(
        (sum, v) => sum + (v.comisionVendedor || 0),
        0,
      );
      const totalComisionesVenta = comisionVentaNormal + comisionVentaUpgrade;
      const totalComisionesSoporte = ventasNormales.reduce(
        (sum, v) => sum + (v.comisionSoporte || 0),
        0,
      );
      const descuentosMetodoPagoPropinas = propinas.reduce(
        (sum, p) => sum + (p.comisionMetodoPagoSoles || 0),
        0,
      );
      const totalComisiones = totalComisionesVenta + totalComisionesSoporte;

      const ventasConDescuento = ventasNormales.filter(
        (v) => v.tipoAjuste === "descuento",
      ).length;
      const ventasConPropina = ventasNormales.filter(
        (v) => v.tipoAjuste === "propina",
      ).length;
      const ventasSinAjuste = ventasNormales.filter(
        (v) => v.tipoAjuste === "ninguno",
      ).length;

      const embed = new EmbedBuilder()
        .setTitle("> HyperV - Reporte Mensual de Ventas y Propinas")
        .setDescription(
          `**Periodo:** ${nombresMeses[mes - 1]} ${año} - Mes Completo\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `**Resumen General**`
        )
        .addFields(
          // Bloque 1 (3)
          { name: "Total Registros", value: `**${totalVentas}**`, inline: true },
          { name: "Ingresos Totales", value: `**S/ ${totalIngresos.toFixed(2)}**`, inline: true },
          { name: "Comisiones Staff", value: `**S/ ${totalComisiones.toFixed(2)}**`, inline: true },
          // sep (1)
          { name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", value: "\u200b", inline: false },
          // Bloque 2 (3)
          { name: "Ventas Normales", value: `${totalVentasNormales}`, inline: true },
          { name: "Upgrades", value: `${totalUpgrades}`, inline: true },
          { name: "Propinas", value: `${totalPropinas}`, inline: true },
          // sep (1)
          { name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", value: "\u200b", inline: false },
          // Bloque 3 — Ads/Discord en 3 campos (sin blank fillers) (3)
          { name: "Ventas Ads", value: `${ventasAds.length}`, inline: true },
          { name: "Ingresos Ads", value: `S/ ${ingresosAds.toFixed(2)}`, inline: true },
          { name: "Ventas Discord", value: `${ventasDiscord.length}`, inline: true },
          // sep (1)
          { name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", value: "\u200b", inline: false },
          // Bloque 4 (3)
          { name: "Ingresos Normales", value: `S/ ${ingresosNormales.toFixed(2)}`, inline: true },
          { name: "Ingresos Upgrades", value: `S/ ${ingresosUpgrades.toFixed(2)}`, inline: true },
          { name: "Ingresos Propinas", value: `S/ ${ingresosPropinas.toFixed(2)}`, inline: true },
          // sep (1)
          { name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", value: "\u200b", inline: false },
          // Bloque 5 (3)
          { name: "Com. Ventas", value: `S/ ${comisionVentaNormal.toFixed(2)}`, inline: true },
          { name: "Com. Upgrades", value: `S/ ${comisionVentaUpgrade.toFixed(2)}`, inline: true },
          { name: "Com. Soporte", value: `S/ ${totalComisionesSoporte.toFixed(2)}`, inline: true },
          // sep (1)
          { name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", value: "\u200b", inline: false },
          // Bloque 6 (3)
          { name: "Desc. Propinas", value: `S/ ${descuentosMetodoPagoPropinas.toFixed(2)}`, inline: true },
          { name: "Sin Ajuste", value: `${ventasSinAjuste}`, inline: true },
          { name: "Con Descuento", value: `${ventasConDescuento}`, inline: true },
          // Archivo (1)
          { name: "Archivo Generado", value: `\`${attachment.name}\``, inline: false },
        )
        .setColor(config.embedColor)
        .setFooter({ text: `Generado por ${interaction.user.username}` })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
        files: [attachment],
        ephemeral: true,
      });

      console.log(
        `Reporte mensual generado: ${nombresMeses[mes - 1]} ${año} - ${totalVentasNormales} normales + ${totalUpgrades} upgrades + ${totalPropinas} propinas = ${totalVentas} total (${interaction.user.tag})`,
      );
    } catch (error) {
      console.error("Error generando reporte mensual:", error);
      await interaction.editReply({
        content: `❌ Error al generar el reporte: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
