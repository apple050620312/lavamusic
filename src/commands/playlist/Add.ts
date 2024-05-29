import { ApplicationCommandOptionType } from 'discord.js';
import { LoadType } from 'shoukaku';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Add extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'add',
            description: {
                content: '將歌曲新增至播放清單',
                examples: ['add <playlist> <song>'],
                usage: 'add <playlist> <song>',
            },
            category: 'playlist',
            aliases: ['add'],
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
                    description: '您要新增的播放清單',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'song',
                    description: '您要新增的歌曲',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlist = args[0];
        const song = args[1];

        if (!playlist)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '請提供播放清單',
                        color: client.color.red,
                    },
                ],
            });

        if (!song)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '請提供歌曲',
                        color: client.color.red,
                    },
                ],
            });

        const playlistData = await client.db.getPlaylist(ctx.author.id, playlist);

        if (!playlistData)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '該播放清單不存在',
                        color: client.color.red,
                    },
                ],
            });

        const res = await client.queue.search(song);
        if (!res)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '沒有找到歌曲',
                        color: client.color.red,
                    },
                ],
            });
        let trackStrings;
        let count;
        if (res.loadType === LoadType.PLAYLIST) {
            trackStrings = res.data.tracks.map(track => track);
            count = res.data.tracks.length;
        } else {
            trackStrings = [res.data[0]];
            count = 1;
        }
        client.db.addSong(ctx.author.id, playlist, trackStrings);

        ctx.sendMessage({
            embeds: [
                {
                    description: `將 ${count} 加入到 ${playlistData.name}`,
                    color: client.color.green,
                },
            ],
        });
    }
}
