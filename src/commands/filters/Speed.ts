import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Speed extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'speed',
            description: {
                content: '設定歌曲的速度',
                examples: ['speed 1.5'],
                usage: 'speed <number>',
            },
            category: 'filters',
            aliases: ['spd'],
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
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: 'speed',
                    description: '您要設定的速度',
                    type: 4,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);

        const speed = Number(args[0]);

        if (isNaN(speed)) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '請提供有效數字',
                        color: client.color.red,
                    },
                ],
            });
        }

        if (speed < 0.5 || speed > 5) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '請提供 0.5 到 5 之間的數字',
                        color: client.color.red,
                    },
                ],
            });
        }

        player.player.setTimescale({ speed });

        return await ctx.sendMessage({
            embeds: [
                {
                    description: `速度已設定為 ${speed}`,
                    color: client.color.main,
                },
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
