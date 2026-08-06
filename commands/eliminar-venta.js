const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { roles } = require('../data/ids');

const salesFilePath = path.join(__dirname, '../data/sales.json');

function loadSales() {
    if (!fs.existsSync(salesFilePath)) {
        return [];
    }
    const data = fs.readFileSync(salesFilePath, 'utf-8');
    return JSON.parse(data);
}

function deleteSale(ventaNumero) {
    const sales = loadSales();
    const index = sales.findIndex((v, i) => i + 1 === ventaNumero);
    
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
        .addIntegerOption(option =>
            option.setName('numero')
                .setDescription('Numero de venta a eliminar')
                .setRequired(true)),

    async execute(interaction) {
        const userRoles = interaction.member.roles.cache;
        const isAdmin = roles.ADMIN.some(adminId => userRoles.has(adminId));

        if (!isAdmin) {
            return await interaction.reply({
                content: '❌ Solo los Admins pueden eliminar ventas.',
                ephemeral: true
            });
        }

        const ventaNumero = interaction.options.getInteger('numero');

        const deleted = deleteSale(ventaNumero);

        if (deleted) {
            await interaction.reply({
                content: `✅ Venta #${ventaNumero} eliminada correctamente del registro.`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `❌ No se encontró la venta #${ventaNumero}.`,
                ephemeral: true
            });
        }
    }
};