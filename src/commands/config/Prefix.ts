import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Prefix extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'prefix',
            description: {
                content: '顯示機器人的前綴',
                examples: ['prefix set', 'prefix reset', 'prefix set !'],
                usage: 'prefix set, prefix reset, prefix set !',
            },
            category: 'general',
            aliases: ['prefix'],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: 'set',
                    description: '設定前綴',
                    type: 1,
                    options: [
                        {
                            name: 'prefix',
                            description: '您要設定的前綴',
                            type: 3,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'reset',
                    description: '將前綴重設為預設前綴',
                    type: 1,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const embed = client.embed().setColor(client.color.main);
        let guild = await client.db.get(ctx.guild.id);

        let subCommand: string;
        let pre: string;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            pre = ctx.interaction.options.data[0].options[0]?.value.toString();
        } else {
            subCommand = args[0];
            pre = args[1];
        }
        switch (subCommand) {
            case 'set':
                if (!pre) {
                    embed.setDescription(
                        `此伺服器的前綴是 \`${guild ? guild.prefix : client.config.prefix
                        }\``
                    );
                    return await ctx.sendMessage({ embeds: [embed] });
                }
                if (pre.length > 3)
                    return await ctx.sendMessage({
                        embeds: [
                            embed.setDescription(`前綴不能超過 3 個字符`),
                        ],
                    });

                if (!guild) {
                    client.db.setPrefix(ctx.guild.id, pre);
                    return await ctx.sendMessage({
                        embeds: [
                            embed.setDescription(`此伺服器的前綴現在是 \`${pre}\``),
                        ],
                    });
                } else {
                    client.db.setPrefix(ctx.guild.id, pre);
                    return await ctx.sendMessage({
                        embeds: [
                            embed.setDescription(`此伺服器的前綴現在是 \`${pre}\``),
                        ],
                    });
                }
            case 'reset':
                if (!guild)
                    return await ctx.sendMessage({
                        embeds: [
                            embed.setDescription(
                                `此伺服器的前綴是 \`${client.config.prefix}\``
                            ),
                        ],
                    });
                client.db.setPrefix(ctx.guild.id, client.config.prefix);
                return await ctx.sendMessage({
                    embeds: [
                        embed.setDescription(
                            `此伺服器的前綴現在是 \`${client.config.prefix}\``
                        ),
                    ],
                });
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
