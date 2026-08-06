const http = require('http');
const ngrok = require('@ngrok/ngrok');
const { EmbedBuilder } = require('discord.js');
const { embedColor, embedFooter, embedThumbnail } = require('../data/config');

const FEEDBACK_CHANNEL_ID = process.env.FEEDBACK_CHANNEL_ID;

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
  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/feedback') {
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
            .setTitle(`> HyperV - Feedback`)
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

    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(25786, '0.0.0.0', () => {
    console.log(`✅ Feedback server corriendo en 0.0.0.0:25786`);
    startTunnel(25786);
  });
}

module.exports = { startFeedbackServer };
