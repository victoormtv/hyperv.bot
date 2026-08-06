const { categories } = require('../data/ids');
const { updateTicketActivity } = require('../utils/inactivityChecker');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    if (message.channel.parentId === categories.TICKETS) {
      await updateTicketActivity(message.channel.id);
    }
  }
};
