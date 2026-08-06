const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../data/config');
const fs = require('fs');
const path = require('path');

const receiptCounterPath = path.join(__dirname, '../data/receiptCounter.json');

function getNextReceiptNumber() {
    let counter = { number: 6129 };
    
    if (fs.existsSync(receiptCounterPath)) {
        const data = fs.readFileSync(receiptCounterPath, 'utf8');
        counter = JSON.parse(data);
    }
    
    const currentNumber = counter.number;
    counter.number++;
    
    fs.writeFileSync(receiptCounterPath, JSON.stringify(counter, null, 2));
    
    return currentNumber;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gracias')
        .setDescription('Envía un mensaje de agradecimiento por la compra'),
    
    async execute(interaction) {
        const fecha = new Date().toLocaleDateString('es-PE', { timeZone: 'America/Lima' });
        const receiptNumber = getNextReceiptNumber();
        const numeroRecibo = `HYPERV-PAYMENT-${receiptNumber}`;
        
        const channelTopic = interaction.channel.topic;
        let userId = null;
        
        if (channelTopic) {
            const match = channelTopic.match(/Ticket creado por (\d+)/);
            if (match) {
                userId = match[1];
            }
        }
        
        if (!userId) {
            const channelName = interaction.channel.name;
            userId = channelName.match(/\d+/)?.[0];
        }
        
        const cliente = userId ? `<@${userId}>` : `<@${interaction.user.id}>`;

        const graciasEmbed = new EmbedBuilder()
            .setTitle('> HyperV | ¡Gracias por tu compra!')
            .setDescription(`Agradecemos tu confianza en nosotros ${cliente}. ¡Disfruta tu producto!`)
            .setImage('https://i.ibb.co/Ldwvyrbn/GRACIAS-POR-TU-COMPRA-HYPER-V.png')
            .addFields(
                { name: 'Número de Recibo', value: `\`${numeroRecibo}\``, inline: true },
                { name: 'Fecha', value: `${fecha}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '📝 Feedback', value: 'Deja tu reseña en <#1407119171191443527> sobre el producto que adquiriste!', inline: false }
            )
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        await interaction.reply({ embeds: [graciasEmbed] });
    },
};
