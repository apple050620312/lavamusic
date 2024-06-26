import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Seek extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'seek',
            description: {
                content: '跳轉至歌曲中的某個時間',
                examples: ['seek 1m, seek 1h 30m'],
                usage: 'seek <time>',
            },
            category: 'music',
            aliases: ['se'],
            cooldown: 3,
            args: true,
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
            options: [
                {
                    name: 'time',
                    description: '欲跳轉的時間',
                    type: 3,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();

        const time = client.utils.parseTime(args[0]);
        if (!time)
            return await ctx.sendMessage({
                embeds: [
                    embed.setColor(this.client.color.red).setDescription('時間格式無效。'),
                ],
            });
        player.seek(time);

        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(`跳轉至 ${args[0]}`)],
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
