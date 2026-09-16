const http = require('http');
const ngrok = require('@ngrok/ngrok');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder } = require('discord.js');
const { embedColor, embedFooter, embedThumbnail } = require('../data/config');

const FEEDBACK_CHANNEL_ID = process.env.FEEDBACK_CHANNEL_ID;
const ROLE_FREE_USER_ID = '1506886171911782481';

// ─── Importar ventas fake para linkearlas ───────────────────────────────────
const fakeVentasEvent = require('../events/fakeVentas');

// ─── Intervalos feedback fake (minutos) ────────────────────────────────────
const INTERVALOS_FEEDBACK = [60, 150, 95, 210, 130, 75, 180, 240];
let indiceFeedback = 0;
let timerFeedback = null;

// ─── Comentarios específicos y coherentes por producto ─────────────────────
const COMENTARIOS_POR_PRODUCTO = {
  'Panel Full': [
    'el panel full es una locura todo en uno vale cada sol',
    'panel full trimestral salio baratisimo comparado a otras tiendas',
    'Muy buen servicio, el panel full va increíble sin lag 🔥',
    'Excelente atención, el panel full tiene de todo'
  ],
  'Bypass ID': [
    'llevo semanas con el bypass id y ni un ban imaginate',
    'bypass id renovado cada mes y jamas tuve problema',
    'Todo al toque, el bypass id funciona de maravilla'
  ],
  'Panel Android': [
    'el panel android va suave ni un lag ni un crash',
    'panel android mensual relacion calidad precio imbatible',
    'Increíble lo fluido que va el panel en mi celu'
  ],
  'Panel iOS': [
    'el aimbot body ios es demasiado preciso no se nota nada',
    'el panel ios es de otro nivel con lo barato que sale',
    'gbox de lujo para la temporada lo uso cada dia'
  ]
};

const COMENTARIOS_GENERALES = [
  'Muy buen servicio, todo llegó rápido y sin problemas 🔥',
  'Excelente atención, el producto funciona perfecto',
  'Todo llegó al toque, recomendado 100%',
  'Primera vez que compro y quedé sorprendido, vuelvo a comprar',
  'El soporte me ayudó al instante, increíble',
  'Funciona de maravilla, muy contento con la compra'
];

const USUARIOS_FEEDBACK_FAKE = [
  'xX_darkside_Xx', 'juancho.ff', 'elcrack2009', 'pipe_rdz', 'nachito_gamer',
  'soyjoseML', 'alexis.pvp', 'el_zurdo07', 'brandon_gg', 'miguel.exe',
  'elias_fr', 'rodrigo2k24', 'fer_nochill', 'danii.co', 'cristhian_ff',
  'nico_slayer', 'mateo.rdx', 'jota_pe', 'luisito_crack', 'el_pato99',
  'yael.mx', 'sebas_123', 'camilo.gg', 'andres.pvp', 'eduin_ff',
  'franco.exe', 'josecito_co', 'emilio_rdz', 'dylan.2k', 'alexito_pe',
  'thiago_ff', 'kevin.sniper', 'el_mono88', 'brayan_col', 'pablito.gg',
  'gael_mx', 'santi.pvp', 'renzo_pe', 'fabian.exe', 'tomas_rdx',
];

const VENDEDORES_FAKE = [
  'fvbrix', 'strixboss', 'HyperV',
  'Matty', 'Em4', 'Josuex'
];

const DESCUBRIMIENTO_FAKE = [
  'Discord', 'TikTok', 'Instagram', 'Un amigo me recomendó',
  'YouTube', 'Otra red', 'Google',
];

const RATING_FAKE = ['⭐⭐⭐⭐⭐ (5/5)', '⭐⭐⭐⭐⭐ (5/5)', '⭐⭐⭐⭐⭐ (5/5)', '⭐⭐⭐⭐ (4/5)'];

const ENCONTRO_FAKE = ['Sí, encontré todo lo que buscaba', 'Sí, y más de lo esperado', 'Sí, sin problemas'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function estaEnHorario() {
  const hora = new Date().getHours();
  return hora >= 8 && hora < 23;
}

// ─── Función para construir contenedor V2 de Feedback ──────────────────────
function buildFeedbackContainer({ usuario, producto, vendedor, descubrimiento, rating, encontro, comentario, imageUrl }) {
  const container = new ContainerBuilder().setAccentColor(embedColor);

  // Si no llega imagen explícita, usa por defecto el embedThumbnail de config
  const finalImage = imageUrl || embedThumbnail;

  if (finalImage) {
    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(finalImage))
    );
  }

  container.addTextDisplayComponents(new TextDisplayBuilder().setContent("## HyperV - Feedback"));

  const contentText = [
    `<:zeusaa:1433927475976474624> **Usuario:** ${usuario}`,
    `<:compra:1316466484133757021> **Producto:** ${producto}`,
    `<:support1:1321973732193075362> **Vendedor y Soporte:** ${vendedor}`,
    `<:website:1459019351410872362> **¿Cómo nos descubriste?:** ${descubrimiento}`,
    `<:estrellaa:1317937061965074524> **Experiencia general:** ${rating}`,
    `<:soporte:1316466482653171763> **¿Encontró lo que buscaba?:** ${encontro}`,
    `<:garantia:1321973733971333150> **Comentarios:** ${comentario}`
  ].join('\n');

  container.addSeparatorComponents(new SeparatorBuilder());
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(contentText));

  return container;
}

async function enviarFeedbackFake(client) {
  if (!estaEnHorario()) {
    programarSiguienteFeedback(client);
    return;
  }

  try {
    const ventas = fakeVentasEvent.getUltimasVentas();
    if (ventas.length === 0) {
      programarSiguienteFeedback(client);
      return;
    }

    const ventaRef = pick(ventas);
    const usuario = pick(USUARIOS_FEEDBACK_FAKE);
    const vendedor = pick(VENDEDORES_FAKE);
    const rating = pick(RATING_FAKE);
    const descubrimiento = pick(DESCUBRIMIENTO_FAKE);
    const encontro = pick(ENCONTRO_FAKE);

    const categoriaProducto = Object.keys(COMENTARIOS_POR_PRODUCTO).find(key =>
      ventaRef.producto.toLowerCase().includes(key.toLowerCase())
    );
    const listaComentarios = categoriaProducto ? COMENTARIOS_POR_PRODUCTO[categoriaProducto] : COMENTARIOS_GENERALES;
    const comentario = pick(listaComentarios);

    const container = buildFeedbackContainer({
      usuario,
      producto: `${ventaRef.producto} ${ventaRef.periodo}`,
      vendedor,
      descubrimiento,
      rating,
      encontro,
      comentario,
      imageUrl: embedThumbnail // Usa el valor por defecto de config
    });

    const botones = [];
    if (ventaRef.messageURL) {
      botones.push(
        new ButtonBuilder()
          .setLabel('Ver Compra')
          .setStyle(ButtonStyle.Link)
          .setURL(ventaRef.messageURL)
          .setEmoji('🧾')
      );
    }

    const channel = await client.channels.fetch(FEEDBACK_CHANNEL_ID);
    await channel.send({
      components: [container, ...(botones.length > 0 ? [new ActionRowBuilder().addComponents(...botones)] : [])],
      flags: MessageFlags.IsComponentsV2
    });

    console.log(`✅ Feedback fake enviado (V2 coherente) — Producto: ${ventaRef.producto}`);
  } catch (error) {
    console.error('❌ Error enviando feedback fake:', error.message);
  }

  programarSiguienteFeedback(client);
}

function programarSiguienteFeedback(client) {
  if (timerFeedback) clearTimeout(timerFeedback);

  const minutos = INTERVALOS_FEEDBACK[indiceFeedback];
  const ms = minutos * 60 * 1000;
  indiceFeedback = (indiceFeedback + 1) % INTERVALOS_FEEDBACK.length;

  timerFeedback = setTimeout(() => {
    enviarFeedbackFake(client);
  }, ms);
}

// ─── Labels reales del formulario ──────────────────────────────────────────
const fieldLabels = {
  question_zK8R4g: '<:zeusaa:1433927475976474624> Usuario',
  question_5dagoQ: '<:compra:1316466484133757021> Producto',
  question_pLY6aJ: '<:support1:1321973732193075362> Vendedor y Soporte',
  question_pLY1WV: '<:website:1459019351410872362> ¿Cómo nos descubriste?',
  question_dYJ4XV: '<:estrellaa:1317937061965074524> Experiencia general',
  question_YZ7KXv: '<:soporte:1316466482653171763> ¿Encontró lo que buscaba?',
  question_MAjqYY: '<:garantia:1321973733971333150> Comentarios',
};

function resolveFieldValue(field) {
  switch (field.type) {
    case 'MULTIPLE_CHOICE': {
      const selected = field.options?.filter(o => field.value?.includes(o.id));
      return selected?.map(o => o.text).join(', ') || 'Sin respuesta';
    }
    case 'CHECKBOXES': {
      if (typeof field.value === 'boolean') return null;
      const selected = field.options?.filter(o => field.value?.includes(o.id));
      return selected?.map(o => o.text).join(', ') || 'Sin respuesta';
    }
    case 'RATING': {
      const stars = '⭐'.repeat(field.value || 0);
      return `${stars} (${field.value}/5)` || 'Sin calificación';
    }
    case 'MATRIX': {
      return field.rows?.map(row => {
        const colId = field.value?.[row.id]?.[0];
        const col = field.columns?.find(c => c.id === colId);
        return `• ${row.text}: **${col?.text || '?'}**`;
      }).join('\n') || 'Sin respuesta';
    }
    case 'FILE_UPLOAD': {
      if (!field.value || field.value.length === 0) return null;
      return field.value.map(f => `[📎 ${f.name}](${f.url})`).join('\n');
    }
    default:
      return String(field.value || 'Sin respuesta');
  }
}

async function startTunnel(port) {
  try {
    const listener = await ngrok.forward({
      addr: port,
      authtoken: process.env.NGROK_TOKEN,
      domain: process.env.NGROK_DOMAIN,
    });
    console.log(`\n🌐 Túnel ngrok activo:`);
    console.log(`👉 ${listener.url()}/feedback\n`);
  } catch (err) {
    console.error('❌ No se pudo crear el túnel ngrok:', err.message);
  }
}

function startFeedbackServer(client) {
  const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID || '1548459490574082098';

  client.on('voiceStateUpdate', async (oldState, newState) => {
    try {
      if (newState.channelId === VOICE_CHANNEL_ID && oldState.channelId !== VOICE_CHANNEL_ID) {
        const member = newState.member;
        if (member && !member.roles.cache.has(ROLE_FREE_USER_ID)) {
          await member.roles.add(ROLE_FREE_USER_ID);
          console.log(`✅ Rol Free User asignado automáticamente a ${member.user.tag}`);
        }
      }
    } catch (err) {
      console.error('❌ Error al asignar el rol en voz:', err.message);
    }
  });

  setTimeout(() => {
    programarSiguienteFeedback(client);
  }, 3 * 60 * 1000);

  const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'GET' && reqUrl.pathname.startsWith('/voice-check/')) {
      const userId = reqUrl.pathname.split('/')[2];
      const secret = req.headers['x-bot-secret'];

      if (!secret || secret !== process.env.BOT_API_SECRET) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ inVoice: false, debug: "BOT_API_SECRET no coincide" }));
      }

      const GUILD_ID = process.env.GUILD_ID;

      if (!userId || !GUILD_ID) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ inVoice: false, debug: "Falta GUILD_ID en .env del bot" }));
      }

      try {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            inVoice: false,
            debug: `El bot no encuentra la Guild con ID: ${GUILD_ID}`
          }));
        }

        const voiceState = guild.voiceStates.cache.get(userId);
        const currentChannelId = voiceState?.channelId || null;
        const inVoice = currentChannelId === VOICE_CHANNEL_ID;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          inVoice,
          debug: {
            userIdBuscado: userId,
            guildNombre: guild.name,
            canalActualDelUsuario: currentChannelId,
            canalEsperado: VOICE_CHANNEL_ID,
            coincide: inVoice
          }
        }));
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ inVoice: false, debug: err.message }));
      }
    }

    if (req.method === 'POST' && reqUrl.pathname === '/feedback') {
      let body = '';

      req.on('data', chunk => { body += chunk.toString(); });

      req.on('end', async () => {
        res.writeHead(200);
        res.end('OK');

        try {
          const payload = JSON.parse(body);
          const { fields } = payload.data;

          const dataMap = {};
          for (const f of fields) {
            if (f.type === 'MATRIX' || f.type === 'FILE_UPLOAD') continue;
            const labelKey = fieldLabels[f.key] || f.label;
            const val = resolveFieldValue(f);
            if (val !== null) dataMap[labelKey] = val;
          }

          const usuario = dataMap['<:zeusaa:1433927475976474624> Usuario'] || 'Anónimo';
          const producto = dataMap['<:compra:1316466484133757021> Producto'] || 'General';
          const vendedor = dataMap['<:support1:1321973732193075362> Vendedor y Soporte'] || 'N/A';
          const descubrimiento = dataMap['<:website:1459019351410872362> ¿Cómo nos descubriste?'] || 'N/A';
          const rating = dataMap['<:estrellaa:1317937061965074524> Experiencia general'] || '⭐⭐⭐⭐⭐ (5/5)';
          const encontro = dataMap['<:soporte:1316466482653171763> ¿Encontró lo que buscaba?'] || 'Sí';
          const comentario = dataMap['<:garantia:1321973733971333150> Comentarios'] || dataMap['Lo que más le gustó'] || 'Sin comentarios';

          const fileField = fields.find(f => f.type === 'FILE_UPLOAD');
          // Si el usuario adjuntó archivo/imagen se usa, si no, se pasa null para que coja el embedThumbnail por defecto
          const imageUrl = fileField?.value?.[0]?.url || null;

          const container = buildFeedbackContainer({
            usuario,
            producto,
            vendedor,
            descubrimiento,
            rating,
            encontro,
            comentario,
            imageUrl
          });

          const channel = await client.channels.fetch(FEEDBACK_CHANNEL_ID);
          await channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
          });

          console.log('✅ Feedback real enviado (V2 con imagen por defecto si falta)');
        } catch (error) {
          console.error('❌ Error procesando feedback real:', error);
        }
      });
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });

  server.listen(25786, '0.0.0.0', () => {
    console.log(`✅ Server corriendo en 0.0.0.0:25786`);
    startTunnel(25786);
  });
}

module.exports = { startFeedbackServer };