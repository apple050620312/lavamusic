import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Queue extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'queue',
            description: {
                content: '顯示目前隊列',
                examples: ['queue'],
                usage: 'queue',
            },
            category: 'music',
            aliases: ['q'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: false,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        if (player.queue.length === 0)
            return await ctx.sendMessage({
                embeds: [
                    this.client
                        .embed()
                        .setColor(this.client.color.main)
                        .setDescription(
                            `現正播放：[${player.current.info.title}](${
                                player.current.info.uri
                            }) - 請求者：${player.current?.info.requester} - Duration: ${
                                player.current.info.isStream
                                    ? '直播'
                                    : this.client.utils.formatTime(player.current.info.length)
                            }`
                        ),
                ],
            });
        const queue = player.queue.map(
            (track, index) =>
                `${index + 1}. [${track.info.title}](${track.info.uri}) - 請求者：${
                    track?.info.requester
                } - 長度${
                    track.info.isStream ? '直播' : this.client.utils.formatTime(track.info.length)
                }`
        );
        let chunks = client.utils.chunk(queue, 10) as any;
        if (chunks.length === 0) chunks = 1;
        const pages = [];
        for (let i = 0; i < chunks.length; i++) {
            const embed = this.client
                .embed()
                .setColor(this.client.color.main)
                .setAuthor({ name: '隊列', iconURL: ctx.guild.iconURL({}) })
                .setDescription(chunks[i].join('\n'))
                .setFooter({ text: `第 ${i + 1} 頁，共 ${chunks.length}` });
            pages.push(embed);
        }

        return await client.utils.paginate(ctx, pages);
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
