import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Rotation extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'rotation',
            description: {
                content: '開啟/關閉旋轉濾波器',
                examples: ['rotation'],
                usage: 'rotation',
            },
            category: 'filters',
            aliases: ['rt'],
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

        if (player.filters.includes('rotation')) {
            player.player.setRotation();
            player.filters.splice(player.filters.indexOf('rotation'), 1);
            ctx.sendMessage({
                embeds: [
                    {
                        description: '旋轉濾波器已停用',
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.player.setRotation({ rotationHz: 0 });
            player.filters.push('rotation');
            ctx.sendMessage({
                embeds: [
                    {
                        description: '旋轉濾波器已啟用',
                        color: client.color.main,
                    },
                ],
            });
        }
    }
}
