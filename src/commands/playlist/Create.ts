import { ApplicationCommandOptionType } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Create extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'create',
            description: {
                content: '建立播放清單',
                examples: ['create <name>'],
                usage: 'create <name>',
            },
            category: 'playlist',
            aliases: ['create'],
            cooldown: 3,
            args: true,
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
            options: [
                {
                    name: 'name',
                    description: '播放清單的名稱',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const name = args.join(' ').replace(/\s/g, '');
        if (name.length > 50)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '播放清單名稱的長度只能是 50 個字符',
                        color: client.color.red,
                    },
                ],
            });
        const playlist = await client.db.getPLaylist(ctx.author.id, name);
        if (playlist)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '同名的播放清單已存在',
                        color: client.color.main,
                    },
                ],
            });
        client.db.createPlaylist(ctx.author.id, name);
        return await ctx.sendMessage({
            embeds: [
                {
                    description: `播放清單 **${name}** 已創建`,
                    color: client.color.main,
                },
            ],
        });
    }
}
