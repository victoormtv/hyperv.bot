const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const config = require('../data/config');
const { channels } = require('../data/ids');
const { commissionRules } = require('../data/commissionRules');

const CONFIGURACION = {
    canalId: channels.FAKE_VENTAS,
    urlComprar: 'https://hyperv.online/products',

    intervalos: [19, 46, 97, 113],
    
    activarEnHorario: {
        inicio: 8,
        fin: 23
    },
    usarUsuariosReales: true,
    guildId: '1117932314102595716'
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

let usuariosCache = [];
let indiceIntervalos = 0; 
let timerActivo = null;

async function obtenerUsuariosReales(client) {
    try {
        const guild = client.guilds.cache.get(CONFIGURACION.guildId);
        if (!guild) {
            return NOMBRES_RESPALDO.map(nombre => ({ 
                username: nombre, 
                avatarURL: config.embedThumbnail 
            }));
        }

        await guild.members.fetch();
        
        const usuarios = guild.members.cache
            .filter(member => !member.user.bot)
            .map(member => {
                const avatarURL = member.user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.${member.user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
                    : member.user.defaultAvatarURL;
                
                return {
                    username: member.user.username,
                    avatarURL: avatarURL
                };
            });

        console.log(`✅ ${usuarios.length} usuarios reales cargados del servidor`);
        return usuarios.length > 0 ? usuarios : NOMBRES_RESPALDO.map(nombre => ({ 
            username: nombre, 
            avatarURL: config.embedThumbnail 
        }));
    } catch (error) {
        console.error('❌ Error obteniendo usuarios:', error.message);
        return NOMBRES_RESPALDO.map(nombre => ({ 
            username: nombre, 
            avatarURL: config.embedThumbnail 
        }));
    }
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
    } else if (monedaCodigo === 'PEN') {
        precio = Math.round(precio);
    } else if (monedaCodigo === 'UYU' || monedaCodigo === 'DOP') {
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
    return hora >= CONFIGURACION.activarEnHorario.inicio && 
           hora < CONFIGURACION.activarEnHorario.fin;
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

    const embed = new EmbedBuilder()
        .setAuthor({ 
            name: venta.cliente,
            iconURL: venta.avatarURL
        })
        .setTitle('> <:shoppp:1472642011197735107> Compra Realizada!')
        .setDescription(
            `**Carrito**\n` +
            `\`1x ${venta.producto} ${venta.periodo}\`\n\n` +
            `**Monto Pagado**\n` +
            `\`${venta.moneda.simbolo} ${venta.precio.toLocaleString()}\``
        )
        .setColor(config.embedColor)
        .setFooter(config.embedFooter);

    const boton = new ButtonBuilder()
        .setLabel('Comprar')
        .setStyle(ButtonStyle.Link)
        .setURL(CONFIGURACION.urlComprar)
        .setEmoji('🛒');

    const row = new ActionRowBuilder().addComponents(boton);

    try {
        await canal.send({ embeds: [embed], components: [row] });
        const intervaloActual = CONFIGURACION.intervalos[indiceIntervalos];
    } catch (error) {
        console.error('❌ Error enviando venta simulada:', error.message);
    }

    programarSiguienteVenta(client);
}

function programarSiguienteVenta(client) {
    if (timerActivo) {
        clearTimeout(timerActivo);
    }

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
        // Cargar usuarios
        if (CONFIGURACION.usarUsuariosReales) {
            usuariosCache = await obtenerUsuariosReales(client);
        } else {
            usuariosCache = NOMBRES_RESPALDO.map(nombre => ({ 
                username: nombre, 
                avatarURL: config.embedThumbnail 
            }));
        }

        setTimeout(() => {
            enviarVentaSimulada(client);
        }, 120000);
    }
};
