import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Volume extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'volume',
            description: {
                content: '設定播放的音量',
                examples: ['volume 100'],
                usage: 'volume <number>',
            },
            category: 'music',
            aliases: ['vol'],
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
                    name: 'number',
                    description: '您要設定的音量',
                    type: 4,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();
        const number = Number(args[0]);
        if (isNaN(number))
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('請提供有效的數字。'),
                ],
            });
        if (number > 200)
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('音量不能高於 200。'),
                ],
            });
        if (number < 0)
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('音量不能低於 0。'),
                ],
            });
        player.player.setGlobalVolume(number);
        return await ctx.sendMessage({
            embeds: [
                embed
                    .setColor(this.client.color.main)
                    .setDescription(`將音量設定為 ${player.player.volume}`),
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
