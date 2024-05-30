import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Pitch extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'pitch',
            description: {
                content: '開啟/關閉音高濾波器',
                examples: ['pitch 1'],
                usage: 'pitch <number>',
            },
            category: 'filters',
            aliases: ['ph'],
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
                    name: 'number',
                    description: '您想要設定音高的數字（從 1~5）',
                    type: 4,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);

        const number = parseInt(args[0]);

        if (isNaN(number) || number < 1 || number > 5) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '請提供 1 到 5 之間的數字',
                        color: client.color.red,
                    },
                ],
            });
        }

        player.player.setTimescale({ pitch: number, rate: 1, speed: 1 });

        return await ctx.sendMessage({
            embeds: [
                {
                    description: `音高已設定為 ${number}`,
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
