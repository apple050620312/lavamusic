import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Distorsion extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'distorsion',
            description: {
                content: '開啟/關閉失真濾波器',
                examples: ['distorsion'],
                usage: 'distorsion',
            },
            category: 'filters',
            aliases: ['distortion'],
            cooldown: 3,
            args: false,
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
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);

        const filterEnabled = player.filters.includes('distorsion');

        if (filterEnabled) {
            player.player.setDistortion({});
            player.filters = player.filters.filter(filter => filter !== 'distorsion');
            ctx.sendMessage({
                embeds: [
                    {
                        description: '失真濾波器已停用',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setDistortion({
                sinOffset: 0,
                sinScale: 1,
                cosOffset: 0,
                cosScale: 1,
                tanOffset: 0,
                tanScale: 1,
                offset: 0,
                scale: 1,
            });
            player.filters.push('distorsion');
            ctx.sendMessage({
                embeds: [
                    {
                        description: '失真濾波器已啟用',
                        color: client.color.main,
                    },
                ],
            });
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
