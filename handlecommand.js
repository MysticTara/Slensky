const { Client } = require("discord.js");

const { readdirSync, read } = require("fs");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  try {
    console.log("-".repeat(36).yellow);
    console.log("[!] Initiating Command Handler!".blue);
    console.log("-".repeat(36).yellow);

    const dirs = readdirSync("./commands");

    // object to store command structure data
    const commands = { total_cmds: 0, total_categs: 0, commands: {}, categories: [] };

    const isDir = (path) => {
      try {
        readdirSync(path);
        return true;
      } catch {
        return false;
      }
    };

    dirs.map((category) => {
      if (isDir(`./commands/${category}`)) {
        commands.categories.push(category);
        commands.total_categs++;

        const categ_files = readdirSync(`./commands/${category}`);

        categ_files.map(async (cmd) => {
          if (isDir(`./commands/${category}/${cmd}`)) {
            const sub_categ_files = readdirSync(`./commands/${category}/${cmd}`);

            sub_categ_files.map(async (sub_cmd) => {
              if (isDir(`./commands/${category}/${cmd}/${sub_cmd}`)) {
                const sub_2_categ_files = readdirSync(`./commands/${category}/${cmd}/${sub_cmd}`);

                sub_2_categ_files.map(async (ultra_sub_cmd) => {
                  try {
                    const k = require(`../commands/${category}/${cmd}/${sub_cmd}/${ultra_sub_cmd}`);
                    k.category = category;
                    if (!k.name && !k.run) {
                      console.log(`[⨯] Failed to load [${`${cmd} ${sub_cmd} ${ultra_sub_cmd.split(".js")[0]}`.cyan}`.red + `] Command`.red);
                    } else {
                      commands.commands[`${cmd} ${sub_cmd} ${k.name}`] = k;
                      commands.total_cmds++;
                      console.log(`[✔] loaded [${`${cmd} ${sub_cmd} ${k.name}`.cyan}`.green + `] Command`.green);
                    }
                  } catch (err) {
                    console.log(`[⨯] Failed to load Command : ${cmd.split(".js")[0]}\nError: `, err);
                  }
                });
              } else {
                try {
                  const k = require(`../commands/${category}/${cmd}/${sub_cmd}`);
                  k.category = category;
                  if (!k.name && !k.run) {
                    console.log(`[⨯] Failed to load [${`${cmd} ${sub_cmd.split(".js")[0]}`.cyan}`.red + `] Command`.red);
                  } else {
                    commands.commands[`${cmd} ${k.name}`] = k;
                    commands.total_cmds++;
                    console.log(`[✔] loaded [${`${cmd} ${k.name}`.cyan}`.green + `] Command`.green);
                  }
                } catch (err) {
                  console.log(`[⨯] Failed to load Command : ${cmd.split(".js")[0]}\nError: `, err);
                }
              }
            });
          } else {
            try {
              const k = require(`../commands/${category}/${cmd}`);
              k.category = category;
              if (!k.name && !k.run) {
                console.log(`[⨯] Failed to load [${cmd.split(".js")[0].cyan}`.red + `] Command`.red);
              } else {
                commands.commands[k.name] = k;
                commands.total_cmds++;
                console.log(`[✔] loaded [${k.name.cyan}`.green + `] Command`.green);
              }
            } catch (err) {
              console.log(`[⨯] Failed to load Command : ${cmd.split(".js")[0]}\nError: `, err);
            }
          }
        });
      }
    });

    client.commands = commands

    console.log("-".repeat(36).yellow);
  } catch (err) {
    client.error(err);
  }
};
