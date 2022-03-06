const = discord.js
const { Client, Interaction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
module.exports = {
  name: "help",
  description: "Some Help To User",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  // just for telling that u can also add options
  execute: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;

      await interaction.deferReply().catch((_) => {});

      const dirs = [...new Set(client.slashCommands.map((c) => c.directory))];

      const helpArray = dirs.map((d) => {
        const getCmd = client.slashCommands
          .filter((c) => c.directory === d)
          .map((c) => {
            return {
              name: c.name || "No Name",
              description: c.description || "No Description",
            };
          });
        return {
          name: d,
          commands: getCmd,
        };
      });


# (c) Neyo Golden
      // default Page No.
      let pageNo = 1;

      const embed = new MessageEmbed()
        .setColor("WHITE")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setAuthor(`Help Command!`)
        .setTimestamp()
        .setFooter(`Page ${pageNo}/${helpArray.length}`);

      const getButtons = (pageNo) => {
        return new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Previous")
            .setCustomId("prev")
            .setStyle("SUCCESS")
            .setDisabled(pageNo <= 1),
          new MessageButton()
            .setLabel("Next")
            .setCustomId("next")
            .setStyle("SUCCESS")
            .setDisabled(!(pageNo < helpArray.length)),
        );
      };

      embed.setDescription(`**${helpArray[pageNo - 1].name}**`).addFields(
        helpArray[pageNo - 1].commands.map(({ name, description }) => {
          return {
            name: `\`${name}\``,
            value: `${description}`,
            inline: true,
          };
        }),
      );

      const intrMsg = await interaction.editReply({ embeds: [embed], components: [getButtons(pageNo)], fetchReply: true });

      const collector = intrMsg.createMessageComponentCollector({ time: 600000, componentType: "BUTTON" });

      collector.on("collect", async (i) => {
        if (i.customId === "next") {
          pageNo++;
        } else if (i.customId === "prev") {
          pageNo--;
        }

        const categ = helpArray[pageNo - 1];

        embed.fields = [];
        embed.setDescription(`**${categ.name}**`).addFields(
          categ.commands.map(({ name, description }) => {
            return {
              name: `\`${name}\``,
              value: `${description}`,
              inline: true,
            };
          }),
        ).setFooter(`Page ${pageNo}/${helpArray.length}`);

        await i.update({ embeds: [embed], components: [getButtons(pageNo)], fetchReply: true });
      });
    } catch (err) {
      console.log("Something Went Wrong => ", err);
    }
  },
};
