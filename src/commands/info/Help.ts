import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Help extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'help',
            description: {
                content: '顯示幫助選單',
                examples: ['help'],
                usage: 'help',
            },
            category: 'info',
            aliases: ['h'],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: 'command',
                    description: '您想要獲得資訊的指令',
                    type: 3,
                    required: false,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const embed = client.embed();
        const guild = await client.db.get(ctx.guild.id);
        const commands = this.client.commands.filter(cmd => cmd.category !== 'dev');
        const categories = commands
            .map(cmd => cmd.category)
            .filter((value, index, self) => self.indexOf(value) === index);

        if (!args[0]) {
            const fildes = [];
            categories.forEach(category => {
                fildes.push({
                    name: category,
                    value: commands
                        .filter(cmd => cmd.category === category)
                        .map(cmd => `\`${cmd.name}\``)
                        .join(', '),
                    inline: false,
                });
            });
            const helpEmbed = embed
                .setColor(this.client.color.main)
                .setTitle('幫助選單')
                .setDescription(
                    `嘿！ 我是 ${this.client.user.username}，一個用 [Lavamusic](https://github.com/appujet/lavamusic) 和 Discord 製作的音樂機器人。 您可以使用 \`${guild.prefix}help <command>\` 來取得更多關於指令的資訊。`
                )
                .setFooter({
                    text: `使用 ${guild.prefix}help <command> 獲得有關指令的更多資訊`,
                });
            fildes.forEach(field => helpEmbed.addFields(field));
            ctx.sendMessage({ embeds: [helpEmbed] });
        } else {
            const command = this.client.commands.get(args[0].toLowerCase());
            if (!command)
                return await ctx.sendMessage({
                    embeds: [
                        client
                            .embed()
                            .setColor(client.color.red)
                            .setDescription(`未找到指令 \`${args[0]}\``),
                    ],
                });
            const embed = this.client.embed();
            const helpEmbed = embed
                .setColor(this.client.color.main)
                .setTitle(`幫助選單 - ${command.name}`).setDescription(`**描述：** ${command.description.content
                    }
**用法：** ${guild.prefix}${command.description.usage}
**範例：** ${command.description.examples.map(example => `${guild.prefix}${example}`).join(', ')}
**別名：** ${command.aliases.map(alias => `\`${alias}\``).join(', ')}
**類別：** ${command.category}
**冷卻：** ${command.cooldown} 秒
**權限：** ${command.permissions.user.length > 0
                        ? command.permissions.user.map(perm => `\`${perm}\``).join(', ')
                        : 'None'
                    }
**機器人權限：** ${command.permissions.client.map(perm => `\`${perm}\``).join(', ')}
**僅限開發人員：** ${command.permissions.dev ? '是' : '否'}
**斜線指令：** ${command.slashCommand ? '是' : '否'}
**參數：** ${command.args ? '是' : '否'}
**Player:** ${command.player.active ? '是' : '否'}
**DJ:** ${command.player.dj ? '是' : '否'}
**DJ 權限：** ${command.player.djPerm ? command.player.djPerm : 'None'}
**Voice:** ${command.player.voice ? '是' : '否'}`);
            ctx.sendMessage({ embeds: [helpEmbed] });
        }
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
