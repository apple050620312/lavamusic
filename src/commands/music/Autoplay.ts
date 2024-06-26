import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Autoplay extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'autoplay',
            description: {
                content: '切換自動播放',
                examples: ['autoplay'],
                usage: 'autoplay',
            },
            category: 'music',
            aliases: ['ap'],
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
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);
        const embed = this.client.embed();

        const autoplay = player.autoplay;
        if (!autoplay) {
            embed.setDescription(`自動播放已啟用`).setColor(client.color.main);
            player.setAutoplay(true);
        } else {
            embed.setDescription(`自動播放已停用`).setColor(client.color.main);
            player.setAutoplay(false);
        }
        ctx.sendMessage({ embeds: [embed] });
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
