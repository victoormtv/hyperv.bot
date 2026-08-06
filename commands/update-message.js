const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update-message')
    .setDescription('Actualiza un mensaje específico con embed/menú')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName('canal')
        .setDescription('ID del canal')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('mensaje')
        .setDescription('ID del mensaje')
        .setRequired(true)),

  async execute(interaction) {
    const canalId = interaction.options.getString('canal');
    const mensajeId = interaction.options.getString('mensaje');

    try {
      delete require.cache[require.resolve('../data/menus.js')];
      const menus = require('../data/menus.js');

      delete require.cache[require.resolve('../data/channelData.js')];
      const channelData = require('../data/channelData.js');

      const channel = await interaction.client.channels.fetch(canalId);
      const message = await channel.messages.fetch(mensajeId);

      const item = channelData.find(i => i.id === canalId && i.messageId === mensajeId);

      if (!item) {
        return interaction.reply({ content: '❌ No se encontró configuración para ese mensaje', ephemeral: true });
      }

      const editOptions = { embeds: [item.embed] };
      if (item.menu) {
        editOptions.components = [item.menu];
      }

      await message.edit(editOptions);
      await interaction.reply({ content: '✅ Mensaje actualizado exitosamente', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
    }
  },
};
