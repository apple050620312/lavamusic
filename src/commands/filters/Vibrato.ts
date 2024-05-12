import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Vibrato extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'vibrato',
            description: {
                content: '開啟/關閉抖音濾波器',
                examples: ['vibrato'],
                usage: 'vibrato',
            },
            category: 'filters',
            aliases: ['vb'],
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
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild.id);

        if (player.filters.includes('vibrato')) {
            player.player.setVibrato();
            player.filters.splice(player.filters.indexOf('vibrato'), 1);
            ctx.sendMessage({
                embeds: [
                    {
                        description: '抖音濾波器已停用',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setVibrato({ depth: 0.75, frequency: 4 });
            player.filters.push('vibrato');
            ctx.sendMessage({
                embeds: [
                    {
                        description: '抖音濾波器已啟用',
                        color: client.color.main,
                    },
                ],
            });
        }
    }
}
