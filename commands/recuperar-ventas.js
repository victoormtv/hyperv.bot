const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { getCommission, convertToSoles, calcularMontoNeto, calcularAjusteAutomatico, obtenerComisionFijaPorMoneda } = require("../data/commissionRules");

const salesFilePath = path.join(__dirname, "../data/sales.json");

const metodosPagoConMonedaFija = {
    "Yape/Plin": "PEN", "BCP Soles": "PEN", "Interbank Soles": "PEN",
    "Scotiabank Soles": "PEN", "BBVA Soles": "PEN", "Interbank Dolares": "USD",
    Zelle: "USD", CashApp: "USD", "Banco Estado": "CLP", Nequi: "COP",
    Prex: "UYU", Bizum: "EUR", BanRural: "GTQ", "BCP Bolivia": "BOB",
    "Spin Oxxo": "MXN", "Clabe Nubank": "MXN", "CBU Mercado Pago": "ARS",
    "Banco Pichincha": "USD", BanReserva: "DOP",
};

function loadSales() {
    if (!fs.existsSync(salesFilePath)) return [];
    return JSON.parse(fs.readFileSync(salesFilePath, "utf-8"));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("recuperar-ventas")
        .setDescription("Recupera ventas perdidas del canal leyendo los embeds")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(o => o.setName("desde").setDescription("Número de venta desde").setRequired(true))
        .addIntegerOption(o => o.setName("hasta").setDescription("Número de venta hasta").setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const desde = interaction.options.getInteger("desde");
        const hasta = interaction.options.getInteger("hasta");
        const canalId = "1435397350049714206";
        const canal = interaction.client.channels.cache.get(canalId);

        if (!canal) {
            return interaction.editReply("❌ No se encontró el canal.");
        }

        const sales = loadSales();
        const numerosExistentes = new Set(sales.map(v => v.numeroVenta));

        // Fetch mensajes en lotes
        let mensajes = [];
        let lastId = null;
        let seguir = true;

        await interaction.editReply("⏳ Leyendo mensajes del canal...");

        while (seguir) {
            const opciones = { limit: 100 };
            if (lastId) opciones.before = lastId;

            const lote = await canal.messages.fetch(opciones);
            if (lote.size === 0) break;

            for (const msg of lote.values()) {
                mensajes.push(msg);
            }

            lastId = lote.last().id;

            // Si el mensaje más antiguo del lote es anterior a agosto 2026, parar
            const oldest = lote.last().createdAt;
            if (oldest < new Date("2026-08-01")) seguir = false;
            if (mensajes.length > 5000) seguir = false;
        }

        const recuperadas = [];
        const errores = [];

        for (const msg of mensajes) {
            if (!msg.embeds || msg.embeds.length === 0) continue;
            const embed = msg.embeds[0];
            if (!embed.title || !embed.title.includes("VENTA #")) continue;

            // Extraer número de venta
            const match = embed.title.match(/VENTA #(\d+)/);
            if (!match) continue;
            const numeroVenta = parseInt(match[1]);

            if (numeroVenta < desde || numeroVenta > hasta) continue;
            if (numerosExistentes.has(numeroVenta)) continue;

            try {
                // Parsear description para vendedor
                const descMatch = embed.description?.match(/<@(\d+)>/);
                const vendedorId = descMatch ? descMatch[1] : null;
                const vendedorMember = vendedorId ? await interaction.guild.members.fetch(vendedorId).catch(() => null) : null;
                const vendedor = vendedorMember ? vendedorMember.user.tag : (vendedorId || "Desconocido");

                // Parsear fields
                const fields = {};
                for (const f of embed.fields) {
                    fields[f.name] = f.value;
                }

                const whatsapp = fields["WhatsApp"] || "No proporcionado";
                const metodoPago = fields["Método de Pago"] || "Yape/Plin";
                const producto = fields["Producto"] || "Desconocido";
                const periodo = fields["Período"] || "Mensual";
                const tipoRaw = fields["Tipo"] || "💬 Discord";
                const tipoVenta = tipoRaw.includes("Ads") ? "ads" : "discord";
                const soporteRaw = fields["Soporte"] || "No requerido";
                const requiereSoporte = soporteRaw !== "No requerido";

                // Monto
                const montoRaw = fields["Monto"] || "0 PEN";
                const montoMatch = montoRaw.match(/([\d.]+)\s+(\w+)/);
                const precioCobrado = montoMatch ? parseFloat(montoMatch[1]) : 0;
                const monedaOriginal = montoMatch ? montoMatch[2] : (metodosPagoConMonedaFija[metodoPago] || "PEN");

                // Recalcular comisiones
                const productoBase = producto.split(" + ")[0];
                const periodoBase = periodo.split(" + ")[0];
                const comisiones = getCommission(productoBase, periodoBase);

                let comisionVentaBase = comisiones.venta;
                let comisionSoporteBase = comisiones.soporte;
                let precioEstandarTotal = comisiones.precioEstandar;

                if (producto.includes(" + ")) {
                    const productoAd = producto.split(" + ")[1];
                    const periodoAd = periodo.split(" + ")[1] || periodoBase;
                    const comAd = getCommission(productoAd, periodoAd);
                    comisionVentaBase += comAd.venta;
                    comisionSoporteBase += comAd.soporte;
                    precioEstandarTotal += comAd.precioEstandar;
                }

                if (!requiereSoporte) comisionSoporteBase = 0;

                const detallesPago = calcularMontoNeto(precioCobrado, metodoPago, monedaOriginal);
                const montoNetoSoles = convertToSoles(detallesPago.montoNeto, monedaOriginal);
                const comisionMetodoPagoSoles = convertToSoles(detallesPago.comisionTotal, monedaOriginal);
                const ajuste = calcularAjusteAutomatico(montoNetoSoles, precioEstandarTotal);

                let comisionVentaFinal = comisionVentaBase;
                if (tipoVenta === "ads") comisionVentaFinal *= 0.85;
                if (ajuste.tipo === "descuento") comisionVentaFinal *= montoNetoSoles / precioEstandarTotal;
                else if (ajuste.tipo === "propina") comisionVentaFinal += ajuste.propina;

                const comisionFija = obtenerComisionFijaPorMoneda(monedaOriginal);
                if (comisionFija > 0) comisionVentaFinal += comisionFija;

                // Soporte
                let vendedorSoporte = "Pendiente";
                if (!requiereSoporte) vendedorSoporte = "No requerido";
                else if (soporteRaw.includes("<@")) {
                    const soporteMatch = soporteRaw.match(/<@(\d+)>/);
                    if (soporteMatch) {
                        const soporteMember = await interaction.guild.members.fetch(soporteMatch[1]).catch(() => null);
                        vendedorSoporte = soporteMember ? soporteMember.user.tag : soporteRaw;
                    }
                } else if (soporteRaw.includes("Expirado")) {
                    vendedorSoporte = "Expirado (12h)";
                }

                const ventaData = {
                    numeroVenta,
                    tipoVenta,
                    descuentoAds: tipoVenta === "ads" ? 15 : 0,
                    vendedor,
                    vendedorId: vendedorId || null,
                    canal: canal.name,
                    canalId: canal.id,
                    whatsapp,
                    metodoPago,
                    producto,
                    periodo,
                    precioEstandar: precioEstandarTotal,
                    montoBrutoCliente: parseFloat(detallesPago.montoBruto.toFixed(2)),
                    comisionMetodoPago: parseFloat(detallesPago.comisionTotal.toFixed(2)),
                    montoNetoRecibido: parseFloat(detallesPago.montoNeto.toFixed(2)),
                    monedaOriginal,
                    precioRealSoles: parseFloat(montoNetoSoles.toFixed(2)),
                    comisionMetodoPagoSoles: parseFloat(comisionMetodoPagoSoles.toFixed(2)),
                    descuento: ajuste.descuento,
                    propina: ajuste.propina,
                    tipoAjuste: ajuste.tipo,
                    diferenciaPorcentaje: ajuste.diferenciaPorcentaje,
                    comisionFija,
                    nota: fields["Nota"] || "",
                    comisionVentaBase,
                    comisionSoporteBase,
                    comisionVenta: parseFloat(comisionVentaFinal.toFixed(2)),
                    comisionSoporte: parseFloat(comisionSoporteBase.toFixed(2)),
                    monedaComision: "Soles",
                    requiereSoporte,
                    vendedorSoporte,
                    vendedorSoporteId: null,
                    imagen: embed.image?.url || null,
                    licencia: "N/A",
                    messageId: msg.id,
                    fecha: msg.createdAt.toISOString(),
                    recuperada: true,
                };

                recuperadas.push(ventaData);
            } catch (err) {
                errores.push(`#${numeroVenta}: ${err.message}`);
            }
        }

        if (recuperadas.length === 0) {
            return interaction.editReply(`❌ No se encontraron ventas para recuperar entre #${desde} y #${hasta}.`);
        }

        // Insertar en orden en el JSON
        for (const venta of recuperadas) {
            const idx = sales.findIndex(v => v.numeroVenta > venta.numeroVenta);
            if (idx === -1) sales.push(venta);
            else sales.splice(idx, 0, venta);
        }

        fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));

        await interaction.editReply(
            `✅ Recuperadas **${recuperadas.length}** ventas (#${desde}-#${hasta}).\n` +
            (errores.length ? `⚠️ Errores en: ${errores.join(", ")}` : "")
        );
    },
};