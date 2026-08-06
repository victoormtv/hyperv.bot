const { Client } = require("discord.js");
const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");
const config = require("../data/config");

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});

const RSS_FEED_URL =
  "https://rss-bridge.org/bridge01/?action=display&context=Username&u=_hypervgg&bridge=InstagramBridge&format=Atom";
const CHECK_INTERVAL = 1 * 60 * 1000;
const LAST_POST_FILE = path.join(__dirname, "../data/lastInstagramPost.json");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    checkForNewPosts(client);
    setInterval(() => checkForNewPosts(client), CHECK_INTERVAL);
  },
};

async function checkForNewPosts(client) {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    const channelId = require("../data/ids").channels.INSTAGRAM_NOTIFICATIONS;
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      console.error("❌ Canal de Instagram no encontrado");
      return;
    }

    let lastPost = loadLastPost();
    const latestPost = feed.items[0];

    if (!latestPost) return;

    if (!lastPost || lastPost.link !== latestPost.link) {
      let imageUrl = null;

      if (latestPost.enclosure && latestPost.enclosure.url) {
        imageUrl = latestPost.enclosure.url;
      } else if (
        latestPost["media:content"] &&
        latestPost["media:content"].$ &&
        latestPost["media:content"].$.url
      ) {
        imageUrl = latestPost["media:content"].$.url;
      } else if (
        latestPost["media:thumbnail"] &&
        latestPost["media:thumbnail"].$ &&
        latestPost["media:thumbnail"].$.url
      ) {
        imageUrl = latestPost["media:thumbnail"].$.url;
      } else if (latestPost.content) {
        const imgMatch = latestPost.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      const description = latestPost.title
        ? `${latestPost.title}\n\nIngresa a nuestro reel: ${latestPost.link}`
        : `Nuevo post en nuestro Instagram! Siguenos para enterarte de las ultimas novedades`;

      const embed = {
        color: config.embedColor,
        title: "> Instagram Reel",
        description: description,
        thumbnail: { url: config.embedThumbnail },
        footer: config.embedFooter,
        timestamp: new Date(latestPost.pubDate),
      };

      if (imageUrl) {
        embed.image = { url: imageUrl };
      }

      await channel.send({
        content: "@everyone",
        embeds: [embed],
      });

      saveLastPost({
        link: latestPost.link,
        title: latestPost.title,
        date: latestPost.pubDate,
      });
    }
  } catch (error) {
    console.error("❌ Error al verificar Instagram:", error);
  }
}

function loadLastPost() {
  try {
    if (fs.existsSync(LAST_POST_FILE)) {
      return JSON.parse(fs.readFileSync(LAST_POST_FILE, "utf8"));
    }
  } catch (error) {
    console.error("Error al cargar última publicación:", error);
  }
  return null;
}

function saveLastPost(postData) {
  try {
    fs.writeFileSync(LAST_POST_FILE, JSON.stringify(postData, null, 2));
  } catch (error) {
    console.error("Error al guardar última publicación:", error);
  }
}
