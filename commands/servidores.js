const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../data/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servidores')
    .setDescription('Muestra la lista de servidores donde está el bot'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    console.log('Cache antes del fetch:', interaction.client.guilds.cache.size);

    // Fetch completo de todos los guilds
    const guilds = await interaction.client.guilds.fetch();
      console.log('Guilds después del fetch:', guilds.size);
  guilds.forEach(g => console.log(' -', g.name, g.id));
    await interaction.editReply(`Cache: ${interaction.client.guilds.cache.size} | Fetch: ${guilds.size}`);

    // Fetch individual para obtener memberCount (no viene en el fetch inicial)
    const servidoresDetalle = await Promise.all(
      guilds.map(async (guildOAuth2) => {
        const guild = await interaction.client.guilds.fetch(guildOAuth2.id);
        return `• ${guild.name} (ID: ${guild.id}) - ${guild.memberCount} miembros`;
      })
    );

    if (!servidoresDetalle.length) {
      return interaction.editReply('El bot no está en ningún servidor.');
    }

    const chunks = [];
    let chunk = '';

    for (const linea of servidoresDetalle) {
      if ((chunk + '\n' + linea).length > 4000) {
        chunks.push(chunk);
        chunk = linea;
      } else {
        chunk = chunk ? chunk + '\n' + linea : linea;
      }
    }
    if (chunk) chunks.push(chunk);

    const embeds = chunks.map((desc, i) =>
      new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(i === 0 ? 'Servidores del bot' : null)
        .setDescription(desc)
        .setFooter(
          i === chunks.length - 1
            ? { text: `Total: ${servidoresDetalle.length} servidores` }
            : null
        )
    );

    await interaction.editReply({ embeds });
  }
};