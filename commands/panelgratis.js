const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const config = require("../data/config");
const { roles } = require("../data/ids");

const expiryMap = {
    "1 dia": 1,
    "2 dias": 2,
    "3 dias": 3,
};

async function generateKeyAuthLicense(dias) {
    const sellerKey = process.env.KEYAUTH_SELLER_KEY;
    if (!sellerKey) throw new Error("No se encontró KEYAUTH_SELLER_KEY en .env");

    const url = `https://teamfirmeza.com/api/seller.php?sellerkey=${sellerKey}&type=add&expiry=${dias}&mask=XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX&level=1&amount=1&owner=&character=2&note=${encodeURIComponent("Panel Secure Gratis - " + dias + " dias")}&format=json`;

    const response = await axios.get(url);
    if (response.data.success) return response.data.key;
    throw new Error(response.data.message || "Error desconocido al generar licencia");
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panelgratis")
        .setDescription("Genera una key gratuita de Panel Secure")
        .addStringOption((option) =>
            option
                .setName("dias")
                .setDescription("Duración de la key")
                .setRequired(true)
                .addChoices(
                    { name: "1 día", value: "1 dia" },
                    { name: "2 días", value: "2 dias" },
                    { name: "3 días", value: "3 dias" },
                ),
        ),

    async execute(interaction) {
        const member = interaction.member;
        const adminRoles = [roles.ADMIN, roles.VENDOR].flat().filter(Boolean);
        const esAdmin = adminRoles.some((roleId) => member.roles.cache.has(roleId));

        if (!esAdmin) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ Solo los **Admins** y **Vendors** pueden usar este comando.")
                        .setColor("#ff0000"),
                ],
                ephemeral: true,
            });
        }

        await interaction.deferReply({ ephemeral: false });

        const diasOpcion = interaction.options.getString("dias");
        const dias = expiryMap[diasOpcion];

        let key;
        try {
            key = await generateKeyAuthLicense(dias);
        } catch (error) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`❌ Error al generar la licencia: ${error.message}`)
                        .setColor("#ff0000"),
                ],
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("> Tu Panel FREE fue APROBADO")
            .setDescription(
                `<@${interaction.user.id}>\n\n` +
                "- **Producto:** Panel Gratis\n" +
                `- **Duración:** ${diasOpcion}\n\n` +
                "- **Tu licencia:**\n" +
                `\`\`\`${key}\`\`\`\n\n` +
                "Ingresa aquí y sigue los pasos:\nhttps://hyperv.online/free/panel-free/\n\n" +
                "¿Te gustó? Contacta con nuestro equipo para adquirir algunos de nuestros planes.",
            )
            .setColor(config.embedColor)
            .setFooter(config.embedFooter)
            .setTimestamp();

        await interaction.editReply({
            content: "",
            embeds: [embed],
        });
    },
};