import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class BassBoost extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'bassboost',
            description: {
                content: '開啟/關閉低音增強',
                examples: ['bassboost'],
                usage: 'bassboost',
            },
            category: 'filters',
            aliases: ['bb'],
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

        const filterEnabled = player.filters.includes('bassboost');

        if (filterEnabled) {
            player.player.setEqualizer([]);
            player.filters = player.filters.filter(filter => filter !== 'bassboost');
            ctx.sendMessage({
                embeds: [
                    {
                        description: '低音增強已停用',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setEqualizer([
                { band: 0, gain: 0.34 },
                { band: 1, gain: 0.34 },
                { band: 2, gain: 0.34 },
                { band: 3, gain: 0.34 },
            ]);
            player.filters.push('bassboost');
            ctx.sendMessage({
                embeds: [
                    {
                        description: '低音增強已啟用',
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
