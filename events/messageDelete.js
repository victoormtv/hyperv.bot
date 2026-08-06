const fs = require('fs');
const path = require('path');

const salesFilePath = path.join(__dirname, '../data/sales.json');

function loadSales() {
    if (!fs.existsSync(salesFilePath)) {
        return [];
    }
    const data = fs.readFileSync(salesFilePath, 'utf-8');
    return JSON.parse(data);
}

function deleteSaleByMessageId(messageId) {
    const sales = loadSales();
    const index = sales.findIndex(v => v.messageId === messageId);
    
    if (index !== -1) {
        const deletedItem = sales[index];
        sales.splice(index, 1);
        fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));
        return deletedItem;
    }
    return null;
}

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        if (message.author && message.author.bot && message.embeds.length > 0) {
            const embed = message.embeds[0];
            
            if (embed.title && (embed.title.includes('VENTA #') || 
                                embed.title.includes('UPGRADE #') || 
                                embed.title.includes('PROPINA #'))) {
                
                const deleted = deleteSaleByMessageId(message.id);
                
                if (deleted) {
                    const tipo = deleted.tipoVenta === 'upgrade' ? 'Upgrade' : 
                                deleted.tipoVenta === 'propina' ? 'Propina' : 'Venta';
                    console.log(`✅ ${tipo} #${deleted.numeroVenta} eliminada automáticamente (mensaje ID: ${message.id})`);
                }
            }
        }
    }
};
