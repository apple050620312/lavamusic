import { ApplicationCommandOptionType } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index';

export default class Delete extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'delete',
            description: {
                content: 'Deletes a playlist',
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
                    description: 'The playlist you want to delete',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlist = args.join(' ').replace(/\s/g, '');

        const playlistExists = await client.prisma.playlist.findFirst({
            where: {
                userId: ctx.author.id,
                name: playlist,
            },
        });
        if (!playlistExists)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'That playlist doesn\'t exist',
                        color: client.color.red,
                    },
                ],
            });
        await client.prisma.playlist.delete({
            where: {
                id: playlistExists.id,
            },
        });
        return await ctx.sendMessage({
            embeds: [
                {
                    description: `Deleted playlist **${playlist}**`,
                    color: client.color.main,
                },
            ],
        });
    }
}
