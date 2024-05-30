import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Remove extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'remove',
            description: {
                content: '從隊列中刪除歌曲',
                examples: ['remove 1'],
                usage: 'remove <song number>',
            },
            category: 'music',
            aliases: ['rm'],
            cooldown: 3,
            args: true,
            player: {
                voice: true,
                dj: true,
                active: true,
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
                    name: 'song',
                    description: '歌曲編號',
                    type: 4,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        if (!player.queue.length)
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('隊列中沒有歌曲。'),
                ],
            });
        if (isNaN(Number(args[0])))
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('這不是一個有效的數字。'),
                ],
            });
        if (Number(args[0]) > player.queue.length)
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('這不是一個有效的數字。'),
                ],
            });
        if (Number(args[0]) < 1)
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('這不是一個有效的數字。'),
                ],
            });
        player.remove(Number(args[0]) - 1);
        return await ctx.sendMessage({
            embeds: [
                embed
                    .setColor(this.client.color.main)
                    .setDescription(`已從佇列中刪除歌曲編號 ${Number(args[0])}`),
            ],
        });
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
