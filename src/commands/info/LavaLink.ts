import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class LavaLink extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'lavalink',
            description: {
                content: '顯示當前 Lavalink 統計數據',
                examples: ['lavalink'],
                usage: 'lavalink',
            },
            category: 'info',
            aliases: ['ll'],
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
        const embed = this.client
            .embed()
            .setTitle('Lavalink 狀態')
            .setColor(this.client.color.main)
            .setThumbnail(this.client.user.avatarURL({}))
            .setTimestamp();

        client.shoukaku.nodes.forEach(node => {
            const statusEmoji = node.stats ? '🟢' : '🔴';
            const stats = node.stats || {
                players: 0,
                playingPlayers: 0,
                uptime: 0,
                cpu: { cores: 0, systemLoad: 0, lavalinkLoad: 0 },
                memory: { used: 0, reservable: 0 },
            };

            const formattedStats = `\`\`\`yaml
播放器：${stats.players}
正在播放的播放器：${stats.playingPlayers}
上線時間：${client.utils.formatTime(stats.uptime)}
核心：${stats.cpu.cores} 核
記憶體用量：${client.utils.formatBytes(stats.memory.used)} / ${client.utils.formatBytes(stats.memory.reservable)}
系統負載：${(stats.cpu.systemLoad * 100).toFixed(2)}%
Lavalink 負載：${(stats.cpu.lavalinkLoad * 100).toFixed(2)}%
\`\`\``;

            embed.addFields({
                name: `名稱：${node.name} (${statusEmoji})`,
                value: formattedStats,
            });
        });

        return await ctx.sendMessage({ embeds: [embed] });
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
