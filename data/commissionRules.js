const axios = require("axios");

const commissionRules = {
  "Panel Full": {
    Semanal: { venta: 10, soporte: 10, moneda: "Soles", precioEstandar: 60 },
    Mensual: { venta: 20, soporte: 10, moneda: "Soles", precioEstandar: 110 },
    Trimestral: { venta: 30, soporte: 10, moneda: "Soles", precioEstandar: 150,
    },
    Anual: { venta: 40, soporte: 10, moneda: "Soles", precioEstandar: 200 },
  },
  "Panel Secure": {
    Semanal: { venta: 8, soporte: 5, moneda: "Soles", precioEstandar: 40 },
    Mensual: { venta: 15, soporte: 5, moneda: "Soles", precioEstandar: 80 },
    Trimestral: { venta: 20, soporte: 5, moneda: "Soles", precioEstandar: 120 },
    Anual: { venta: 30, soporte: 5, moneda: "Soles", precioEstandar: 150 },
  },
  "Panel Only Aimbot": {
    Semanal: { venta: 5, soporte: 5, moneda: "Soles", precioEstandar: 20 },
    Mensual: { venta: 10, soporte: 5, moneda: "Soles", precioEstandar: 55 },
    Trimestral: { venta: 15, soporte: 5, moneda: "Soles", precioEstandar: 90 },
    Anual: { venta: 25, soporte: 5, moneda: "Soles", precioEstandar: 130 },
  },
  "Bypass APK": {
    Semanal: { venta: 10, soporte: 5, moneda: "Soles", precioEstandar: 60 },
    Mensual: { venta: 15, soporte: 5, moneda: "Soles", precioEstandar: 130 },
  },
  "Bypass ID": {
    "1 dia" : { venta: 3, soporte: 5, moneda: "Soles", precioEstandar: 10 },
    Semanal: { venta: 10, soporte: 5, moneda: "Soles", precioEstandar: 30 },
    Mensual: { venta: 20, soporte: 5, moneda: "Soles", precioEstandar: 90 },
    Trimestral: { venta: 25, soporte: 5, moneda: "Soles", precioEstandar: 140 },
    Anual: { venta: 30, soporte: 5, moneda: "Soles", precioEstandar: 190 },
  },
  "Bypass Global": {
    "1 dia" : { venta: 3, soporte: 5, moneda: "Soles", precioEstandar: 10 },
    Semanal: { venta: 10, soporte: 5, moneda: "Soles", precioEstandar: 30 },
    "14 dias": { venta: 15, soporte: 5, moneda: "Soles", precioEstandar: 50 },
    Mensual: { venta: 20, soporte: 5, moneda: "Soles", precioEstandar: 100 },
  },
  "Menu Chams": {
    Semanal: { venta: 5, soporte: 5, moneda: "Soles", precioEstandar: 25 },
    Mensual: { venta: 15, soporte: 5, moneda: "Soles", precioEstandar: 50 },
    Trimestral: { venta: 10, soporte: 5, moneda: "Soles", precioEstandar: 70 },
    Anual: { venta: 30, soporte: 5, moneda: "Soles", precioEstandar: 90 },
  },
  "Panel iOS": {
    "1 dia": { venta: 5, soporte: 10, moneda: "Soles", precioEstandar: 35 },
    Semanal: { venta: 10, soporte: 10, moneda: "Soles", precioEstandar: 85 },
    Mensual: { venta: 25, soporte: 10, moneda: "Soles", precioEstandar: 160 },
  },
  "Gbox": {
    "Por Temporada": { venta: 0, soporte: 0, moneda: "Soles", precioEstandar: 20 },
  },
  "Regedit": {
    Mensual: { venta: 15, soporte: 15, moneda: "Soles", precioEstandar: 80 },
    Anual: { venta: 30, soporte: 15, moneda: "Soles", precioEstandar: 130 },
  },
  "Aimbot Body iOS": {
    "Por Temporada": { venta: 20, soporte: 15, moneda: "Soles", precioEstandar: 200},
  },
  "Panel Android": {
    Semanal: { venta: 10, soporte: 10, moneda: "Soles", precioEstandar: 35 },
    "14 dias": { venta: 15, soporte: 10, moneda: "Soles", precioEstandar: 60 },
    Mensual: { venta: 20, soporte: 10, moneda: "Soles", precioEstandar: 100 },
    "60 dias": { venta: 30, soporte: 10, moneda: "Soles", precioEstandar: 150 },
  },
  "Aimbot Proxy": {
    Semanal: { venta: 10, soporte: 10, moneda: "Soles", precioEstandar: 85 },
    Mensual: { venta: 25, soporte: 10, moneda: "Soles", precioEstandar: 190 },
  },
  "Panel COD iOS": {
    "1 dia": { venta: 5, soporte: 10, moneda: "Soles", precioEstandar: 55 },
    "14 dias": { venta: 8, soporte: 10, moneda: "Soles", precioEstandar: 100 },
    Mensual: { venta: 10, soporte: 10, moneda: "Soles", precioEstandar: 180 },
  },
  "Panel CSGO": {
    Semanal: { venta: 15, soporte: 10, moneda: "Soles", precioEstandar: 100 },
    Mensual: { venta: 25, soporte: 10, moneda: "Soles", precioEstandar: 170 },
  },
  "Aimlock": {
    Anual: { venta: 25, soporte: 15, moneda: "Soles", precioEstandar: 180 },
  },
  "Aimbot Color": {
    Semanal: { venta: 10, soporte: 10, moneda: "Soles", precioEstandar: 60 },
    Mensual: { venta: 20, soporte: 10, moneda: "Soles", precioEstandar: 110 },
    Trimestral: { venta: 30, soporte: 10, moneda: "Soles", precioEstandar: 220 },
  },
  Spoofer: {
    Permanente: { venta: 30, soporte: 15, moneda: "Soles", precioEstandar: 200 },
  },
  "Panel Warzone": {
    "15 dias": { venta: 10, soporte: 10, moneda: "Soles", precioEstandar: 110 },
    Mensual: { venta: 20, soporte: 10, moneda: "Soles", precioEstandar: 200 },
  },
};

const exchangeRatesFijas = {
  PEN: 1,
  Soles: 1,
  MXN: 1 / 6.2,
  CLP: 1 / 270,
  COP: 1 / 5000,
  BOB: 1 / 3.6,
};

let exchangeRatesDinamicas = {
  USD: 3.37,
  ARS: 1 / 600, // valor fallback, se actualiza dinámicamente
  DOP: 0.056,
  UYU: 0.082,
  GTQ: 0.43,
  BRL: 0.56,
  EUR: 3.65,
};

const comisionesMetodoPago = {
  PayPal: {
    porcentaje: 5.4,
    fijo: 0.3,
    moneda: "USD",
  },
  Binance: {
    porcentaje: 0.5,
    fijo: 0,
    moneda: "USD",
  },
  "Western Union": {
    porcentaje: 3.0,
    fijo: 2.0,
    moneda: "USD",
  },
  Remitly: {
    porcentaje: 2.5,
    fijo: 0,
    moneda: "USD",
  },
  CashApp: {
    porcentaje: 5.4,
    fijo: 0.3,
    moneda: "USD",
  },
  "CashApp Business": {
    porcentaje: 2.75,
    fijo: 0,
    moneda: "USD",
  },
  "Prex Uruguay": {
    porcentaje: 0,
    fijo: 0,
    moneda: "UYU",
  },
  "Banrural Guatemala": {
    porcentaje: 0,
    fijo: 0,
    moneda: "GTQ",
  },
  "Banco Pichincha": {
    porcentaje: 0,
    fijo: 0,
    moneda: "USD",
  },
  "Bizum España": {
    porcentaje: 0,
    fijo: 0,
    moneda: "EUR",
  },
  "Yape/Plin": {
    porcentaje: 0,
    fijo: 0,
    moneda: "PEN",
  },
  "BCP Soles": { porcentaje: 0, fijo: 0, moneda: "PEN" },
  "Interbank Soles": { porcentaje: 0, fijo: 0, moneda: "PEN" },
  "Interbank Dolares": { porcentaje: 0, fijo: 0, moneda: "USD" },
  "Scotiabank Soles": { porcentaje: 0, fijo: 0, moneda: "PEN" },
  "BBVA Soles": { porcentaje: 0, fijo: 0, moneda: "PEN" },
  Zelle: {
    porcentaje: 5.4,
    fijo: 0.3,
    moneda: "USD",
  },
  Nequi: { porcentaje: 0, fijo: 0, moneda: "COP" },
  "BCP Bolivia": { porcentaje: 0, fijo: 0, moneda: "BOB" },
  "Spin Oxxo": { porcentaje: 0, fijo: 0, moneda: "MXN" },
  "Clabe Nubank": { porcentaje: 0, fijo: 0, moneda: "MXN" },
  "CBU Mercado Pago": { porcentaje: 0, fijo: 0, moneda: "ARS" },
  "Banco Guayaquil": { porcentaje: 0, fijo: 0, moneda: "USD" },
  "Banco Estado": { porcentaje: 0, fijo: 0, moneda: "CLP" },
  BanReserva: { porcentaje: 0, fijo: 0, moneda: "DOP" },
  otro: { porcentaje: 0, fijo: 0, moneda: "PEN" },
};

async function actualizarTasasDeCambio() {
  try {
    const API_KEY =
      process.env.EXCHANGE_RATE_API_KEY || "f4ab0c0ecc7a54a52cced91e";
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/PEN`,
    );

    if (response.data && response.data.result === "success") {
      const rates = response.data.conversion_rates;
      exchangeRatesDinamicas["USD"] = 1 / rates.USD;
      exchangeRatesDinamicas["ARS"] = 1 / rates.ARS;
      exchangeRatesDinamicas["DOP"] = 1 / rates.DOP;
      exchangeRatesDinamicas["UYU"] = 1 / rates.UYU;
      exchangeRatesDinamicas["GTQ"] = 1 / rates.GTQ;
      exchangeRatesDinamicas["BRL"] = 1 / rates.BRL;
      exchangeRatesDinamicas["EUR"] = 1 / rates.EUR;

      console.log(
        "✅ Tasas de cambio actualizadas:",
        new Date().toLocaleString(),
      );
      console.log("💵 USD a PEN:", exchangeRatesDinamicas["USD"].toFixed(4));
      console.log("💵 ARS a PEN:", exchangeRatesDinamicas["ARS"].toFixed(6));
      return true;
    } else {
      console.warn(
        "⚠️ No se pudieron actualizar tasas de cambio, usando fallback",
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Error actualizando tasas de cambio:", error.message);
    console.log("📌 Usando tasas de cambio fallback");
    return false;
  }
}

function convertToSoles(cantidad, moneda) {
  if (moneda === "ARS") {
    const comisionFija = 2000;
    const cantidadNeta = cantidad - comisionFija;
    const tasaDinamica = exchangeRatesDinamicas["ARS"];
    return cantidadNeta * tasaDinamica;
  }

  if (
    exchangeRatesFijas[moneda] !== undefined &&
    exchangeRatesFijas[moneda] !== null
  ) {
    const tasaFija = exchangeRatesFijas[moneda];

    if (moneda === "COP") {
      const cantidadUSD = cantidad * tasaFija;
      const usdToPen = exchangeRatesDinamicas["USD"] || 3.37;
      return cantidadUSD * usdToPen;
    }

    return cantidad * tasaFija;
  }

  const tasa = exchangeRatesDinamicas[moneda] || 1;
  return cantidad * tasa;
}

// Reemplaza al antiguo objeto fijo `comisionesFijasPorMoneda`.
// Calcula la comisión fija (en soles) en el momento de la venta,
// usando siempre la tasa de cambio dinámica más reciente.
function obtenerComisionFijaPorMoneda(moneda) {
  if (moneda === "ARS") {
    return 2000 * exchangeRatesDinamicas["ARS"];
  }
  return 0;
}

function calcularMontoNeto(montoBruto, metodoPago, monedaPago) {
  const comision = comisionesMetodoPago[metodoPago] || {
    porcentaje: 0,
    fijo: 0,
    moneda: monedaPago,
  };
  const comisionPorcentaje = (montoBruto * comision.porcentaje) / 100;
  const comisionTotal = comisionPorcentaje + comision.fijo;
  const montoNeto = montoBruto - comisionTotal;

  return {
    montoBruto: montoBruto,
    comisionPorcentaje: comisionPorcentaje,
    comisionFija: comision.fijo,
    comisionTotal: comisionTotal,
    montoNeto: montoNeto,
    monedaComision: comision.moneda,
  };
}

function calcularAjusteAutomatico(montoNetoSoles, precioEstandar) {
  const diferencia = montoNetoSoles - precioEstandar;
  const diferenciaPorcentaje = ((diferencia / precioEstandar) * 100).toFixed(2);

  if (Math.abs(diferencia) <= precioEstandar * 0.02) {
    return {
      tipo: "ninguno",
      descuento: 0,
      propina: 0,
      diferenciaPorcentaje: 0,
      diferenciaMonto: 0,
      mensaje: "Precio estándar (dentro del margen de tolerancia)",
    };
  }

  if (diferencia < 0) {
    return {
      tipo: "descuento",
      descuento: Math.abs(diferencia),
      propina: 0,
      diferenciaPorcentaje: parseFloat(diferenciaPorcentaje),
      diferenciaMonto: diferencia,
      mensaje: `Descuento aplicado: S/ ${Math.abs(diferencia).toFixed(2)} (${Math.abs(diferenciaPorcentaje)}%)`,
    };
  } else {
    return {
      tipo: "propina",
      descuento: 0,
      propina: diferencia,
      diferenciaPorcentaje: parseFloat(diferenciaPorcentaje),
      diferenciaMonto: diferencia,
      mensaje: `Propina recibida: S/ ${diferencia.toFixed(2)} (+${diferenciaPorcentaje}%)`,
    };
  }
}

function getCommission(producto, periodo) {
  if (commissionRules[producto] && commissionRules[producto][periodo]) {
    return commissionRules[producto][periodo];
  }
  return { venta: 0, soporte: 0, moneda: "Soles", precioEstandar: 0 };
}

function obtenerTasaCambio(moneda) {
  if (
    exchangeRatesFijas[moneda] !== undefined &&
    exchangeRatesFijas[moneda] !== null
  ) {
    return {
      valor: exchangeRatesFijas[moneda],
      tipo: "fija",
      moneda: moneda,
    };
  }

  return {
    valor: exchangeRatesDinamicas[moneda] || 1,
    tipo: "dinámica",
    moneda: moneda,
  };
}

function calcularUpgrade(
  precioOriginal,
  precioNuevo,
  montoCobrado,
  moneda,
  metodoPago,
) {
  if (precioNuevo <= precioOriginal) {
    return {
      esValido: false,
      error: `El plan nuevo (S/ ${precioNuevo}) debe ser más caro que el plan original (S/ ${precioOriginal})`,
    };
  }

  const diferenciaEsperada = precioNuevo - precioOriginal;
  const detallesPago = calcularMontoNeto(montoCobrado, metodoPago, moneda);
  const montoNetoSoles = convertToSoles(detallesPago.montoNeto, moneda);
  const comisionMetodoPagoSoles = convertToSoles(
    detallesPago.comisionTotal,
    moneda,
  );
  const tolerancia = 0.1;

  if (montoNetoSoles < diferenciaEsperada * (1 - tolerancia)) {
    return {
      esValido: false,
      error: `El monto cobrado (S/ ${montoNetoSoles.toFixed(2)} neto) es muy bajo. Se esperaba al menos S/ ${(diferenciaEsperada * (1 - tolerancia)).toFixed(2)}`,
    };
  }

  const comisionVendedor = diferenciaEsperada * 0.3;

  return {
    esValido: true,
    diferenciaEsperada: diferenciaEsperada,
    montoBruto: montoCobrado,
    montoNeto: detallesPago.montoNeto,
    montoNetoSoles: montoNetoSoles,
    comisionMetodoPago: detallesPago.comisionTotal,
    comisionMetodoPagoSoles: comisionMetodoPagoSoles,
    comisionVendedor: comisionVendedor,
    comisionSoporte: 0,
    porcentajeComision: 30,
  };
}

module.exports = {
  commissionRules,
  getCommission,
  exchangeRatesFijas,
  exchangeRatesDinamicas,
  convertToSoles,
  obtenerComisionFijaPorMoneda,
  actualizarTasasDeCambio,
  comisionesMetodoPago,
  calcularMontoNeto,
  obtenerTasaCambio,
  calcularAjusteAutomatico,
  calcularUpgrade,
};