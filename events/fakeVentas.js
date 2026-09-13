const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const config = require('../data/config');
const { channels, embeds } = require('../data/ids');
const { commissionRules } = require('../data/commissionRules');

const CONFIGURACION = {
    canalId: channels.FAKE_VENTAS,
    intervalos: [400, 1890, 970, 2400, 113, 180, 497],
    activarEnHorario: { inicio: 8, fin: 23 },
    usarUsuariosReales: true,
    guildId: '1117932314102595716'
};

const PRODUCTO_CANAL = {
    'Panel Full': embeds.PANEL_FULL,
    'Panel Secure': '1176254214851268718',
    'Panel Only Aimbot': embeds.PANEL_ONLY_AIMBOT,
    'Menu Basic': embeds.MENU_BASIC,
    'Bypass APK': embeds.BYPASS_APK,
    'Bypass ID': embeds.BYPASS_ID,
    'Bypass Global': embeds.BYPASS_GLOBAL,
    'Menu Chams': '1317281105228861471',
    'Panel iOS': embeds.PANEL_IOS,
    'Gbox': embeds.PANEL_IOS,
    'Regedit': embeds.REGEDIT,
    'Aimbot Body iOS': embeds.AIMBOT_BODY_IOS,
    'Panel Android': embeds.PANEL_ANDROID,
    'Aimbot Proxy': embeds.AIMBOT_PROXY,
    'Panel COD iOS': embeds.PANEL_COD_IOS,
    'Panel CSGO': embeds.PANEL_CSGO,
    'Aimlock': embeds.AIMLOCK,
    'Aimbot Color': embeds.AIMBOT_COLOR,
    'Spoofer': embeds.SPOOFER,
    'Panel Warzone': embeds.PANEL_WARZONE,
    'Aimbot Body Android': '1476269244563067030',
};

const MONEDAS = {
    'PEN': { simbolo: 'S/', tasa: 1 },
    'USD': { simbolo: '$', tasa: 0.27 },
    'ARS': { simbolo: 'ARS', tasa: 180 },
    'MXN': { simbolo: 'MXN', tasa: 4.8 },
    'CLP': { simbolo: 'CLP', tasa: 250 },
    'COP': { simbolo: 'COP', tasa: 1100 },
    'BOB': { simbolo: 'Bs', tasa: 1.85 },
    'UYU': { simbolo: '$U', tasa: 11.5 },
    'EUR': { simbolo: '€', tasa: 0.25 },
    'DOP': { simbolo: 'RD$', tasa: 16 },
    'GTQ': { simbolo: 'Q', tasa: 2.1 }
};

const NOMBRES_RESPALDO = [
    'Ttralha', 'Tu_viejo', 'tio Paolo', 'vixoag17', 'volcan',
    'waleed', 'Woody', 'Xavi', 'Xiovzz68', 'xxbenjaminxx4540',
    'XxStyIez', 'XYZ', 'ZORO', 'x2AIKITO', 'yadielthebest',
    'Yannier Alvarez', 'YERICO ALMIGHTY!', 'YTiLeninC_2II', 'ZENTRIX.SEXO',
    'zFraz_zG', 'ZodiacEnd', 'ComboXrc', 'JuanGamer', 'ProPlayer'
];

// Últimas ventas fake para que los feedbacks puedan linkearlas
const ultimasVentas = [];
const MAX_VENTAS_GUARDADAS = 20;

let usuariosCache = [];
let indiceIntervalos = 0;
let timerActivo = null;

async function obtenerUsuariosReales(client) {
    try {
        const guild = client.guilds.cache.get(CONFIGURACION.guildId);
        if (!guild) return fallbackUsuarios();

        await guild.members.fetch();

        const usuarios = guild.members.cache
            .filter(member => !member.user.bot)
            .map(member => {
                const avatarURL = member.user.avatar
                    ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.${member.user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
                    : member.user.defaultAvatarURL;
                return { username: member.user.username, avatarURL };
            });

        console.log(`✅ ${usuarios.length} usuarios reales cargados del servidor`);
        return usuarios.length > 0 ? usuarios : fallbackUsuarios();
    } catch (error) {
        console.error('❌ Error obteniendo usuarios:', error.message);
        return fallbackUsuarios();
    }
}

function fallbackUsuarios() {
    return NOMBRES_RESPALDO.map(nombre => ({ username: nombre, avatarURL: config.embedThumbnail }));
}

function generarVenta(clienteData) {
    const productos = Object.keys(commissionRules);
    const producto = productos[Math.floor(Math.random() * productos.length)];
    const periodos = Object.keys(commissionRules[producto]);
    const periodo = periodos[Math.floor(Math.random() * periodos.length)];
    const datosProducto = commissionRules[producto][periodo];

    const monedasArray = Object.keys(MONEDAS);
    const monedaCodigo = monedasArray[Math.floor(Math.random() * monedasArray.length)];
    const moneda = MONEDAS[monedaCodigo];

    const precioBase = datosProducto.precioEstandar * moneda.tasa;
    const variacion = 1 + (Math.random() * 0.15 - 0.075);
    let precio = precioBase * variacion;

    if (['ARS', 'COP', 'CLP'].includes(monedaCodigo)) {
        precio = Math.round(precio / 100) * 100;
    } else if (['PEN', 'UYU', 'DOP'].includes(monedaCodigo)) {
        precio = Math.round(precio);
    } else {
        precio = parseFloat(precio.toFixed(2));
    }

    const idVenta = '#' + Math.floor(Math.random() * 900 + 100) + 'K';

    return {
        producto,
        periodo,
        monedaCodigo,
        moneda,
        precio,
        cliente: clienteData.username,
        avatarURL: clienteData.avatarURL,
        idVenta
    };
}

function estaEnHorario() {
    const hora = new Date().getHours();
    return hora >= CONFIGURACION.activarEnHorario.inicio && hora < CONFIGURACION.activarEnHorario.fin;
}

function getCanalProducto(producto) {
    const canalId = PRODUCTO_CANAL[producto];
    if (!canalId) return null;
    return `https://discord.com/channels/1117932314102595716/${canalId}`;
}

function guardarVenta(venta, messageURL) {
    ultimasVentas.push({ ...venta, messageURL });
    if (ultimasVentas.length > MAX_VENTAS_GUARDADAS) {
        ultimasVentas.shift();
    }
}

function getUltimasVentas() {
    return ultimasVentas;
}

async function enviarVentaSimulada(client) {
    if (!estaEnHorario()) {
        programarSiguienteVenta(client);
        return;
    }

    const canal = client.channels.cache.get(CONFIGURACION.canalId);
    if (!canal) {
        console.error('❌ Canal no encontrado');
        programarSiguienteVenta(client);
        return;
    }

    const clienteData = usuariosCache[Math.floor(Math.random() * usuariosCache.length)];
    const venta = generarVenta(clienteData);

    const urlCanal = getCanalProducto(venta.producto);

    const embed = new EmbedBuilder()
        .setAuthor({ name: venta.cliente, iconURL: venta.avatarURL })
        .setTitle('> <:shoppp:1472642011197735107> Compra Realizada!')
        .setDescription(
            `**Carrito**\n` +
            `\`1x ${venta.producto} ${venta.periodo}\`\n\n` +
            `**Monto Pagado**\n` +
            `\`${venta.moneda.simbolo} ${venta.precio.toLocaleString()}\``
        )
        .setColor(config.embedColor)
        .setFooter(config.embedFooter);

    const botonesComponentes = [];

    if (urlCanal) {
        botonesComponentes.push(
            new ButtonBuilder()
                .setLabel('Ver Producto')
                .setStyle(ButtonStyle.Link)
                .setURL(urlCanal)
                .setEmoji('🛒')
        );
    }

    const row = new ActionRowBuilder().addComponents(...botonesComponentes);

    try {
        const msg = await canal.send({
            embeds: [embed],
            components: botonesComponentes.length > 0 ? [row] : []
        });

        guardarVenta(venta, msg.url);
    } catch (error) {
        console.error('❌ Error enviando venta simulada:', error.message);
    }

    programarSiguienteVenta(client);
}

function programarSiguienteVenta(client) {
    if (timerActivo) clearTimeout(timerActivo);

    const intervaloMinutos = CONFIGURACION.intervalos[indiceIntervalos];
    const milisegundos = intervaloMinutos * 60 * 1000;
    indiceIntervalos = (indiceIntervalos + 1) % CONFIGURACION.intervalos.length;

    timerActivo = setTimeout(() => {
        enviarVentaSimulada(client);
    }, milisegundos);
}

module.exports = {
    name: 'ready',
    once: false,

    async execute(client) {
        if (CONFIGURACION.usarUsuariosReales) {
            usuariosCache = await obtenerUsuariosReales(client);
        } else {
            usuariosCache = fallbackUsuarios();
        }

        setTimeout(() => {
            enviarVentaSimulada(client);
        }, 120000);
    },

    getUltimasVentas
};