import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Ping extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'ping',
            description: {
                content: '顯示機器人的延遲',
                examples: ['ping'],
                usage: 'ping',
            },
            category: 'general',
            aliases: ['pong'],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: false,
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
        const msg = await ctx.sendDeferMessage('正在測量...');

        const embed = this.client
            .embed()
            .setAuthor({ name: '🏓Pong!', iconURL: this.client.user.displayAvatarURL() })
            .setColor(this.client.color.main)
            .addFields([
                {
                    name: '機器人延遲',
                    value: `\`\`\`ini\n[ ${msg.createdTimestamp - ctx.createdTimestamp}ms ]\n\`\`\``,
                    inline: true,
                },
                {
                    name: 'API 延遲',
                    value: `\`\`\`ini\n[ ${Math.round(ctx.client.ws.ping)} 毫秒 ]\n\`\`\``,
                    inline: true,
                },
            ])
            .setFooter({
                text: `請求者：${ctx.author.tag}`,
                iconURL: ctx.author.avatarURL({}),
            })
            .setTimestamp();

        return await ctx.editMessage({ content: '', embeds: [embed] });
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
