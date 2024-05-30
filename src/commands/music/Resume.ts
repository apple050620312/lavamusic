import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Resume extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'resume',
            description: {
                content: '繼續當前歌曲',
                examples: ['resume'],
                usage: 'resume',
            },
            category: 'music',
            aliases: ['r'],
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
        const embed = this.client.embed();
        if (!player.paused)
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription('播放未暫停。'),
                ],
            });
        player.pause();

        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(`已繼續播放`)],
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
