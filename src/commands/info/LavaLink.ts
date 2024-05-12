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
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const embed = this.client.embed();
        embed.setTitle('Lavalink 狀態');
        embed.setColor(this.client.color.main);
        embed.setThumbnail(this.client.user.avatarURL({}));
        embed.setTimestamp();
        client.shoukaku.nodes.forEach(node => {
            if (!node.stats) {
                embed.addFields({
                    name: '名稱：',
                    value: `${node.name} (🔴)\n\`\`\`yaml\n播放器：0\n正在播放的播放器：0\n上線時間：0\n核心：0 核\n記憶體用量：0/0\n系統負載：0%\nLavalink 負載：0%\`\`\``,
                });
                return;
            }
            try {
                embed.addFields({
                    name: '名稱：',
                    value: `${node.name} (${node.stats ? '🟢' : '🔴'})\n\`\`\`yaml\n播放器：${node.stats.players}\n正在播放的播放器：${node.stats.playingPlayers}\n上線時間：${client.utils.formatTime(node.stats.uptime)}\n核心：${node.stats.cpu.cores} 核\n記憶體用量：${client.utils.formatBytes(node.stats.memory.used)}/${client.utils.formatBytes(node.stats.memory.reservable)}\n系統負載：${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%\nLavalink 負載：${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%\`\`\``,
                });
            } catch (e) {
                console.log(e);
            }
        });
        return await ctx.sendMessage({ embeds: [embed] });
    }
}
