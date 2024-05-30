import { LoadType } from 'shoukaku';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Play extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'play',
            description: {
                content: '播放 YouTube 或 Spotify 中的歌曲',
                examples: [
                    'play https://www.youtube.com/watch?v=QH2-TGUlwu4',
                    'play https://open.spotify.com/track/6WrI0LAC5M1Rw2MnX2ZvEg',
                ],
                usage: 'play <song>',
            },
            category: 'music',
            aliases: ['p'],
            cooldown: 3,
            args: true,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'Connect', 'Speak'],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: 'song',
                    description: '你想播放的歌曲',
                    type: 3,
                    required: true,
                    autocomplete: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const query = args.join(' ');
        let player = client.queue.get(ctx.guild.id);
        const vc = ctx.member as any;
        if (!player) player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel);

        const res = await this.client.queue.search(query);
        const embed = this.client.embed();
        switch (res.loadType) {
            case LoadType.ERROR:
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.red)
                            .setDescription('搜尋時出了錯誤。'),
                    ],
                });
                break;
            case LoadType.EMPTY:
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.red)
                            .setDescription('沒有找到結果。'),
                    ],
                });
                break;
            case LoadType.TRACK: {
                const track = player.buildTrack(res.data, ctx.author);
                if (player.queue.length > client.config.maxQueueSize)
                    return await ctx.sendMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(
                                    `隊列太長了。最大長度為 ${client.config.maxQueueSize} 首歌曲。`
                                ),
                        ],
                    });
                player.queue.push(track);
                await player.isPlaying();
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(
                                `已將 [${res.data.info.title}](${res.data.info.uri}) 加入隊列。`
                            ),
                    ],
                });
                break;
            }
            case LoadType.PLAYLIST: {
                if (res.data.tracks.length > client.config.maxPlaylistSize)
                    return await ctx.sendMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(
                                    `播放清單太長。最大長度為 ${client.config.maxPlaylistSize} 首歌曲。`
                                ),
                        ],
                    });
                for (const track of res.data.tracks) {
                    const pl = player.buildTrack(track, ctx.author);
                    if (player.queue.length > client.config.maxQueueSize)
                        return await ctx.sendMessage({
                            embeds: [
                                embed
                                    .setColor(this.client.color.red)
                                    .setDescription(
                                        `隊列太長了。最大長度為 ${client.config.maxQueueSize} 首歌曲。`
                                    ),
                            ],
                        });
                    player.queue.push(pl);
                }
                await player.isPlaying();
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(`將 ${res.data.tracks.length} 首歌曲加入隊列。`),
                    ],
                });
                break;
            }
            case LoadType.SEARCH: {
                const track1 = player.buildTrack(res.data[0], ctx.author);
                if (player.queue.length > client.config.maxQueueSize)
                    return await ctx.sendMessage({
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(
                                    `隊列太長了。最大長度為 ${client.config.maxQueueSize} 首歌曲。`
                                ),
                        ],
                    });
                player.queue.push(track1);
                await player.isPlaying();
                ctx.sendMessage({
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(
                                `將 [${res.data[0].info.title}](${res.data[0].info.uri}) 加入隊列。`
                            ),
                    ],
                });
                break;
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
