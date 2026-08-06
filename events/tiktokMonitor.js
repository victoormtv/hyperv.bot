const { Client } = require('discord.js');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const config = require('../data/config');

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail']
    ]
  }
});

const RSS_FEED_URL = 'https://rss-bridge.org/bridge01/?action=display&context=By+user&username=%40hypervgg&bridge=TikTokBridge&format=Atom';
const CHECK_INTERVAL = 1 * 60 * 1000; // ✅ 1 MINUTO (antes era 1 hora)
const LAST_VIDEO_FILE = path.join(__dirname, '../data/lastTikTokVideo.json');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log('🎵 TikTok monitor iniciado (verificando cada 1 minuto)');
    
    checkForNewVideos(client);
    setInterval(() => checkForNewVideos(client), CHECK_INTERVAL);
  }
};

async function checkForNewVideos(client) {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    const channelId = require('../data/ids').channels.TIKTOK_NOTIFICATIONS;
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      console.error('❌ Canal de TikTok no encontrado');
      return;
    }

    let lastVideo = loadLastVideo();
    const latestVideo = feed.items[0];
    
    if (!latestVideo) return;

    if (!lastVideo || lastVideo.link !== latestVideo.link) {
      let videoImageUrl = null;
      
      if (latestVideo.enclosure && latestVideo.enclosure.url) {
        videoImageUrl = latestVideo.enclosure.url;
      } else if (latestVideo['media:content'] && latestVideo['media:content'].$ && latestVideo['media:content'].$.url) {
        videoImageUrl = latestVideo['media:content'].$.url;
      } else if (latestVideo['media:thumbnail'] && latestVideo['media:thumbnail'].$ && latestVideo['media:thumbnail'].$.url) {
        videoImageUrl = latestVideo['media:thumbnail'].$.url;
      } else if (latestVideo.content) {
        const imgMatch = latestVideo.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) videoImageUrl = imgMatch[1];
      } else if (latestVideo.contentSnippet) {
        const imgMatch = latestVideo.contentSnippet.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/i);
        if (imgMatch) videoImageUrl = imgMatch[1];
      }

      const description = latestVideo.title 
        ? `${latestVideo.title}\n\nIngresa a nuestro video: ${latestVideo.link}`
        : `Nuevo video en nuestro TikTok! Siguenos para enterarte de las ultimas novedades.`;

      const embed = {
        color: config.embedColor,
        title: '> TikTok Video',
        description: description,
        thumbnail: { url: config.embedThumbnail },
        footer: config.embedFooter,
        timestamp: new Date(latestVideo.pubDate)
      };

      if (videoImageUrl) {
        embed.image = { url: videoImageUrl };
      }

      await channel.send({
        content: '@everyone',
        embeds: [embed]
      });

      saveLastVideo({
        link: latestVideo.link,
        title: latestVideo.title,
        date: latestVideo.pubDate
      });

      console.log('✅ Nuevo video de TikTok publicado');
    }
  } catch (error) {
    console.error('❌ Error al verificar TikTok:', error);
  }
}

function loadLastVideo() {
  try {
    if (fs.existsSync(LAST_VIDEO_FILE)) {
      return JSON.parse(fs.readFileSync(LAST_VIDEO_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error al cargar último video:', error);
  }
  return null;
}

function saveLastVideo(videoData) {
  try {
    fs.writeFileSync(LAST_VIDEO_FILE, JSON.stringify(videoData, null, 2));
  } catch (error) {
    console.error('Error al guardar último video:', error);
  }
}