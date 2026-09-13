const http = require('http');
const ngrok = require('@ngrok/ngrok');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { embedColor, embedFooter, embedThumbnail } = require('../data/config');

const FEEDBACK_CHANNEL_ID = process.env.FEEDBACK_CHANNEL_ID;

// ─── Importar ventas fake para linkearlas ───────────────────────────────────
const fakeVentasEvent = require('../events/fakeVentas');

// ─── Intervalos feedback fake (minutos) ────────────────────────────────────
const INTERVALOS_FEEDBACK = [60, 150, 95, 210, 130, 75, 180, 240];
let indiceFeedback = 0;
let timerFeedback = null;

const COMENTARIOS_POSITIVOS = [
  'Muy buen servicio, todo llegó rápido y sin problemas 🔥',
  'Excelente atención, el producto funciona perfecto',
  'Todo llegó al toque, recomendado 100%',
  'Primera vez que compro y quedé sorprendido, vuelvo a comprar',
  'El soporte me ayudó al instante, increíble',
  'Funciona de maravilla, muy contento con la compra',
  'Rápido y confiable, nada que decir en contra',
  'Producto tal cual se describe, sin fallas',
  'Llevo meses comprando acá y nunca falla',
  'El mejor servicio que he encontrado, sin duda',
  'Me sorprendió la rapidez de la entrega',
  'Todo perfecto, el panel funciona sin lag',
  'Buenísimo, ya le recomendé a mis amigos',
  'Compra sin miedo, es de fiar',
  'La atención al cliente es rapida, resolvieron mi duda en segundos',
  // nuevos
  'el panel full es una locura todo en uno vale cada sol',
  'llevo semanas con el bypass id y ni un ban imaginate',
  'el panel android va suave ni un lag ni un crash',
  'el aimbot body ios es demasiado preciso no se nota nada',
  'bypass apk funciona en cualquier version del juego literalmente',
  'el panel ios es de otro nivel con lo barato que sale',
  'menu basic pero no tiene nada de basico jaja cumple re bien',
  'el regedit hizo maravillas en mi pc todo mas fluido',
  'spoofer activo y a jugar sin dramas funciona perfecto',
  'panel csgo sin vac sin nada limpio total',
  'aimbot color demasiado smooth nadie se da cuenta',
  'bypass global en todos mis devices sin problema',
  'panel warzone activo en minutos el soporte es rapido',
  'menu chams increible ves todo sin que se note raro',
  'aimlock preciso y suave no parece hack para nada',
  'panel only aimbot ideal para los que no quieren tanto riesgo',
  'bypass id renovado cada mes y jamas tuve problema',
  'panel full trimestral salio baratisimo comparado a otras tiendas',
  'aimbot proxy sin lag sin delay va como seda',
  'panel cod ios funciona perfecto en mi iphone sin jailbreak',
  'gbox de lujo para la temporada lo uso cada dia',
  'menu basic semanal perfecto para probar antes de comprar mensual',
  'el soporte explica todo paso a paso no te dejan solo',
  'active el bypass global y en 5 minutos ya estaba jugando',
  'panel android mensual relacion calidad precio imbatible',
  'aimbot body ios por temporada y ni un reporte increible',
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
    const comentario = pick(COMENTARIOS_POSITIVOS);
    const rating = pick(RATING_FAKE);
    const descubrimiento = pick(DESCUBRIMIENTO_FAKE);
    const encontro = pick(ENCONTRO_FAKE);

    const embed = new EmbedBuilder()
      .setTitle('> HyperV - Feedback')
      .setColor(embedColor)
      .setThumbnail(embedThumbnail)
      .addFields(
        { name: '<:zeusaa:1433927475976474624> Usuario', value: usuario, inline: true },
        { name: '<:compra:1316466484133757021> Producto', value: `${ventaRef.producto} ${ventaRef.periodo}`, inline: true },
        { name: '<:support1:1321973732193075362> Vendedor y Soporte', value: vendedor, inline: true },
        { name: '<:website:1459019351410872362> ¿Cómo nos descubriste?', value: descubrimiento, inline: true },
        { name: '<:estrellaa:1317937061965074524> Experiencia general', value: rating, inline: true },
        { name: '<:soporte:1316466482653171763> ¿Encontró lo que buscaba?', value: encontro, inline: true },
        { name: '<:garantia:1321973733971333150> Lo que más le gustó', value: comentario, inline: false },
        { name: '💬 Comentarios', value: comentario, inline: false },
      )
      .setFooter(embedFooter)
      .setTimestamp();

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
      embeds: [embed],
      components: botones.length > 0 ? [new ActionRowBuilder().addComponents(...botones)] : []
    });

    console.log(`✅ Feedback fake enviado — referenciando: ${ventaRef.producto} ${ventaRef.periodo}`);
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
  question_MAjqYY: '<:garantia:1321973733971333150> Lo que más le gustó',
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
      if (!field.value || field.value.length === 0) return 'Sin archivo';
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
  // Arrancar feedbacks fake con delay inicial de 3 minutos
  setTimeout(() => {
    programarSiguienteFeedback(client);
  }, 3 * 60 * 1000);

  const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    // ========== RUTA GET: /voice-check/:userId ==========
    if (req.method === 'GET' && reqUrl.pathname.startsWith('/voice-check/')) {
      const userId = reqUrl.pathname.split('/')[2];
      const secret = req.headers['x-bot-secret'];

      if (!secret || secret !== process.env.BOT_API_SECRET) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ inVoice: false, debug: "BOT_API_SECRET no coincide" }));
      }

      const GUILD_ID = process.env.GUILD_ID;
      const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID || '1548459490574082098';

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

    // ========== RUTA POST: /feedback (REAL) ==========
    if (req.method === 'POST' && reqUrl.pathname === '/feedback') {
      let body = '';

      req.on('data', chunk => { body += chunk.toString(); });

      req.on('end', async () => {
        res.writeHead(200);
        res.end('OK');

        try {
          const payload = JSON.parse(body);
          const { fields, formName, createdAt } = payload.data;

          const matrixField = fields.find(f => f.type === 'MATRIX');
          const calificaciones = matrixField ? resolveFieldValue(matrixField) : 'Sin calificación';

          const embedFields = [];

          for (const f of fields) {
            if (f.type === 'MATRIX' || f.type === 'FILE_UPLOAD') continue;

            const value = resolveFieldValue(f);
            if (value === null) continue;

            embedFields.push({
              name: fieldLabels[f.key] || f.label,
              value,
              inline: true
            });
          }

          embedFields.push({
            name: '⭐ Calificaciones',
            value: calificaciones,
            inline: false
          });

          const fileField = fields.find(f => f.type === 'FILE_UPLOAD');
          const imageUrl = fileField?.value?.[0]?.url || null;

          const embed = new EmbedBuilder()
            .setTitle('> HyperV - Feedback')
            .setColor(embedColor)
            .setThumbnail(embedThumbnail)
            .addFields(embedFields)
            .setFooter(embedFooter)
            .setTimestamp(new Date(createdAt));

          if (imageUrl) embed.setImage(imageUrl);

          const channel = await client.channels.fetch(FEEDBACK_CHANNEL_ID);
          await channel.send({ embeds: [embed] });

          console.log('✅ Embed enviado al canal de Discord');
        } catch (error) {
          console.error('❌ Error procesando feedback:', error);
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