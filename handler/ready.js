const { Client, Webhook, WebhookClient, MessageEmbed } = require("discord.js");
const { prefix, logger, color } = require("../config.json");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  client.prefix = prefix;
  client.color = color;

  /**
   *
   * @param {Error} err
   */
  client.error = async (err) => {
    try {
      const isURL = (u) => {
        try {
          new URL(u);
          return true;
        } catch {
          return false;
        }
      };
      if (isURL(logger)) {
        try {
          const loggerhook = new WebhookClient({ url: logger });
          const error_embed = new MessageEmbed().setColor(color).setTitle("Error!").setDescription(`\`\`\`js${err.stack}\n\`\`\``);
          await loggerhook.send({ embeds: [error_embed] });
        } catch {}
      }
      console.log("[ERROR] Occured!".red, err);
    } catch (err) {}
  };
};
