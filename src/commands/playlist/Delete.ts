import { ApplicationCommandOptionType } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Delete extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'delete',
            description: {
                content: '刪除播放清單',
                examples: ['delete <playlist name>'],
                usage: 'delete <playlist name>',
            },
            category: 'playlist',
            aliases: ['delete'],
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
                    name: 'playlist',
                    description: '您要刪除的播放清單',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlist = args.join(' ').replace(/\s/g, '');

        const playlistExists = await client.db.getPLaylist(ctx.author.id, playlist);
        if (!playlistExists)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '該播放清單不存在',
                        color: client.color.red,
                    },
                ],
            });
        client.db.deletePlaylist(ctx.author.id, playlist);
        return await ctx.sendMessage({
            embeds: [
                {
                    description: `已刪除播放清單 **${playlist}**`,
                    color: client.color.main,
                },
            ],
        });
    }
}
