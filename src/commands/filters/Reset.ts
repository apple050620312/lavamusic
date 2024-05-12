import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Reset extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'reset',
            description: {
                content: '重置作用中的濾波器',
                examples: ['reset'],
                usage: 'reset',
            },
            category: 'filters',
            aliases: ['reset'],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: false,
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

        player.player.clearFilters();
        player.filters = [];
        return await ctx.sendMessage({
            embeds: [
                {
                    description: '濾波器已重置',
                    color: client.color.main,
                },
            ],
        });
    }
}
