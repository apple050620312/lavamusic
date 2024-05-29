import {
    ApplicationCommandOptionType,
    ChannelType,
    OverwriteType,
    PermissionFlagsBits,
} from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';
import { getButtons } from '../../utils/Buttons.js';

export default class Setup extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'setup',
            description: {
                content: '設定機器人',
                examples: ['setup create', 'setup delete', 'setup info'],
                usage: 'setup',
            },
            category: 'config',
            aliases: ['setup'],
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
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'ManageChannels'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: 'create',
                    description: '建立點歌頻道',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'delete',
                    description: '刪除點歌頻道',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'info',
                    description: '顯示點歌頻道',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const subCommand = ctx.isInteraction ? ctx.interaction.options.data[0].name : args[0];
        const embed = client.embed().setColor(client.color.main);

        switch (subCommand) {
            case 'create': {
                const data = await client.db.getSetup(ctx.guild.id);
                if (data && data.textId && data.messageId) {
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: '點歌頻道已存在',
                                color: client.color.red,
                            },
                        ],
                    });
                }

                const textChannel = await ctx.guild.channels.create({
                    name: `${this.client.user.username}-點歌`,
                    type: ChannelType.GuildText,
                    topic: '音樂機器人的點歌',
                    permissionOverwrites: [
                        {
                            type: OverwriteType.Member,
                            id: this.client.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.EmbedLinks,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                        {
                            type: OverwriteType.Role,
                            id: ctx.guild.roles.everyone.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                    ],
                });

                const player = this.client.queue.get(ctx.guild.id);
                const image = this.client.config.links.img;
                const desc =
                    player && player.queue && player.current
                        ? `[${player.current.info.title}](${player.current.info.uri})`
                        : '現在沒有播放任何內容';

                embed.setDescription(desc).setImage(image);
                await textChannel
                    .send({ embeds: [embed], components: getButtons(player) })
                    .then(async msg => {
                        client.db.setSetup(ctx.guild.id, textChannel.id, msg.id);
                    });

                const embed2 = client.embed().setColor(client.color.main);
                await ctx.sendMessage({
                    embeds: [
                        embed2.setDescription(
                            `點歌頻道 <#${textChannel.id}> 已創建`
                        ),
                    ],
                });

                break;
            }

            case 'delete': {
                const data2 = await client.db.getSetup(ctx.guild.id);
                if (!data2) {
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: '點歌頻道不存在',
                                color: client.color.red,
                            },
                        ],
                    });
                }

                client.db.deleteSetup(ctx.guild.id);
                const textChannel = ctx.guild.channels.cache.get(data2.textId);
                if (textChannel) await textChannel.delete().catch(() => {});

                await ctx.sendMessage({
                    embeds: [
                        {
                            description: '點歌頻道已刪除',
                            color: client.color.main,
                        },
                    ],
                });

                break;
            }

            case 'info': {
                const data3 = await client.db.getSetup(ctx.guild.id);
                if (!data3) {
                    return await ctx.sendMessage({
                        embeds: [
                            {
                                description: '點歌頻道不存在',
                                color: client.color.red,
                            },
                        ],
                    });
                }

                const channel = ctx.guild.channels.cache.get(data3.textId);
                embed
                    .setDescription(`點歌頻道為 <#${channel.id}>`)
                    .setColor(client.color.main);

                await ctx.sendMessage({ embeds: [embed] });

                break;
            }

            default:
                break;
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
