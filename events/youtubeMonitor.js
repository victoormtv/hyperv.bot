const { Client } = require('discord.js');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const config = require('../data/config');

const parser = new Parser({
  customFields: {
    item: [
      ['media:group', 'media:group'],
      ['media:thumbnail', 'media:thumbnail']
    ]
  }
});

const RSS_FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC0AOh7Kj3zItnFVDDONiGzQ';
const CHECK_INTERVAL = 1 * 60 * 1000;
const LAST_VIDEO_FILE = path.join(__dirname, '../data/lastYouTubeVideo.json');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log('🎬 YouTube monitor iniciado (verificando cada 1 minuto)');
    
    checkForNewVideos(client);
    setInterval(() => checkForNewVideos(client), CHECK_INTERVAL);
  }
};

async function checkForNewVideos(client) {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    const channelId = require('../data/ids').channels.YOUTUBE_NOTIFICATIONS;
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      console.error('❌ Canal de YouTube no encontrado');
      return;
    }

    let lastVideo = loadLastVideo();
    const latestVideo = feed.items[0];
    
    if (!latestVideo) return;

    if (!lastVideo || lastVideo.link !== latestVideo.link) {
      let thumbnailUrl = null;
      
      if (latestVideo['media:group'] && latestVideo['media:group']['media:thumbnail']) {
        const thumbnail = latestVideo['media:group']['media:thumbnail'];
        thumbnailUrl = thumbnail[0] ? thumbnail[0].$ ? thumbnail[0].$.url : thumbnail.$.url : null;
      } else if (latestVideo.enclosure && latestVideo.enclosure.url) {
        thumbnailUrl = latestVideo.enclosure.url;
      } else if (latestVideo.link) {
        const videoIdMatch = latestVideo.link.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
          thumbnailUrl = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
        }
      }

      const description = latestVideo.title 
        ? `${latestVideo.title}\n\nIngresa a nuestro video: ${latestVideo.link}`
        : `Nuevo video en nuestro canal de YouTube! Suscríbete para enterarte de las ultimas novedades.`;

      const embed = {
        color: config.embedColor,
        title: '> Youtube Video',
        description: description, 
        thumbnail: { url: config.embedThumbnail },
        footer: config.embedFooter,
        timestamp: new Date(latestVideo.pubDate)
      };

      if (thumbnailUrl) {
        embed.image = { url: thumbnailUrl };
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

      console.log('✅ Nuevo video de YouTube publicado');
    }
  } catch (error) {
    console.error('❌ Error al verificar YouTube:', error);
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