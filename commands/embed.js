const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../data/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Crea un embed personalizado')
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('Título del embed')
                .setRequired(true)
                .setMaxLength(256))
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Descripción del embed')
                .setRequired(true)
                .setMaxLength(4096))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color hex - Deja vacío para usar el color HyperV')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('imagen')
                .setDescription('URL de la imagen principal')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('URL del thumbnail (imagen pequeña)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('Texto del footer - Deja vacío para usar el footer HyperV')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('autor')
                .setDescription('Nombre del autor del embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('url_titulo')
                .setDescription('URL que se abrirá al hacer clic en el título')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde enviar el embed (opcional)')
                .setRequired(false)),

    async execute(interaction) {
        try {
            const titulo = interaction.options.getString('titulo');
            const descripcion = interaction.options.getString('descripcion');
            const colorInput = interaction.options.getString('color');
            const imagen = interaction.options.getString('imagen');
            const thumbnail = interaction.options.getString('thumbnail');
            const footerInput = interaction.options.getString('footer');
            const autor = interaction.options.getString('autor');
            const urlTitulo = interaction.options.getString('url_titulo');
            const canalDestino = interaction.options.getChannel('canal');

            let color = config.embedColor;
            if (colorInput) {
                const hexColor = colorInput.replace('#', '');
                if (/^[0-9A-F]{6}$/i.test(hexColor)) {
                    color = parseInt(hexColor, 16);
                } else {
                    return interaction.reply({
                        content: '❌ Color inválido. Usa formato hexadecimal como `#FF0000` o `FF0000`',
                        ephemeral: true
                    });
                }
            }

            const urlRegex = /^https?:\/\/.+/i;
            if (imagen && !urlRegex.test(imagen)) {
                return interaction.reply({
                    content: '❌ URL de imagen inválida. Debe comenzar con http:// o https://',
                    ephemeral: true
                });
            }
            if (thumbnail && !urlRegex.test(thumbnail)) {
                return interaction.reply({
                    content: '❌ URL de thumbnail inválida. Debe comenzar con http:// o https://',
                    ephemeral: true
                });
            }
            if (urlTitulo && !urlRegex.test(urlTitulo)) {
                return interaction.reply({
                    content: '❌ URL del título inválida. Debe comenzar con http:// o https://',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(titulo)
                .setDescription(descripcion)
                .setColor(color)
                .setTimestamp();

            if (urlTitulo) embed.setURL(urlTitulo);
            if (imagen) embed.setImage(imagen);
            if (thumbnail) embed.setThumbnail(thumbnail);
            
            if (footerInput) {
                embed.setFooter({ text: footerInput });
            } else {
                embed.setFooter(config.embedFooter);
            }

            if (autor) {
                embed.setAuthor({ 
                    name: autor,
                    iconURL: interaction.user.displayAvatarURL()
                });
            }

            if (canalDestino) {
                if (!canalDestino.isTextBased()) {
                    return interaction.reply({
                        content: '❌ El canal seleccionado no es un canal de texto.',
                        ephemeral: true
                    });
                }

                await canalDestino.send({ embeds: [embed] });
                await interaction.reply({
                    content: `✅ Embed enviado exitosamente a ${canalDestino}`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('❌ Error al crear embed:', error);
            
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Hubo un error al crear el embed. Verifica que las URLs sean válidas.',
                    ephemeral: true
                });
            }
        }
    }
};
