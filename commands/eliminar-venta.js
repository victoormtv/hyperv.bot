const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { roles } = require('../data/ids');
const config = require('../data/config');

const salesFilePath = path.join(__dirname, '../data/sales.json');

function loadSales() {
    if (!fs.existsSync(salesFilePath)) return [];
    return JSON.parse(fs.readFileSync(salesFilePath, 'utf-8'));
}

function deleteSale(ventaNumero) {
    const sales = loadSales();
    const index = sales.findIndex((v) => v.numeroVenta === ventaNumero);
    if (index !== -1) {
        sales.splice(index, 1);
        fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));
        return true;
    }
    return false;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eliminar-venta')
        .setDescription('Eliminar una venta del registro')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((option) =>
            option.setName('numero').setDescription('Numero de venta a eliminar').setRequired(true),
        ),

    async execute(interaction) {
        const isAdmin = roles.ADMIN.some((adminId) => interaction.member.roles.cache.has(adminId));

        if (!isAdmin) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("❌ Solo los **Admins** pueden eliminar ventas.")
                        .setColor("#ff0000"),
                ],
                ephemeral: true,
            });
        }

        const ventaNumero = interaction.options.getInteger("numero");
        const deleted = deleteSale(ventaNumero);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        deleted
                            ? `✅ Venta **#${ventaNumero.toString().padStart(3, "0")}** eliminada correctamente.`
                            : `❌ No se encontró la venta **#${ventaNumero}**.`,
                    )
                    .setColor(deleted ? config.embedColor : "#ff0000"),
            ],
            ephemeral: true,
        });
    },
};