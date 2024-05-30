import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Prefix extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'prefix',
            description: {
                content: '顯示機器人的前綴',
                examples: ['prefix set !', 'prefix reset'],
                usage: 'prefix [set <prefix> | reset]',
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
        const guildId = ctx.guild.id;
        const guildData = await client.db.get(guildId);
        const isInteraction = ctx.isInteraction;
        let subCommand = '';
        let prefix = '';

        if (isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            prefix = ctx.interaction.options.data[0].options[0]?.value.toString();
        } else {
            subCommand = args[0] || '';
            prefix = args[1] || '';
        }

        switch (subCommand) {
            case 'set': {
                if (!prefix) {
                    const currentPrefix = guildData ? guildData.prefix : client.config.prefix;
                    embed.setDescription(`此伺服器的前綴是 \`${currentPrefix}\``);
                    return await ctx.sendMessage({ embeds: [embed] });
                }

                if (prefix.length > 3) {
                    embed.setDescription('前綴不能超過 3 個字符');
                    return await ctx.sendMessage({ embeds: [embed] });
                }

                client.db.setPrefix(guildId, prefix);
                embed.setDescription(`此伺服器的前綴現在是 \`${prefix}\``);
                return await ctx.sendMessage({ embeds: [embed] });
            }

            case 'reset': {
                const defaultPrefix = client.config.prefix;
                client.db.setPrefix(guildId, defaultPrefix);
                embed.setDescription(`此伺服器的前綴現在是 \`${defaultPrefix}\``);
                return await ctx.sendMessage({ embeds: [embed] });
            }

            default: {
                const currentPrefix = guildData ? guildData.prefix : client.config.prefix;
                embed.setDescription(`此伺服器的前綴是 \`${currentPrefix}\``);
                return await ctx.sendMessage({ embeds: [embed] });
            }
        }
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
