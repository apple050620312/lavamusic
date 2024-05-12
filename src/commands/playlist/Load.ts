import { ApplicationCommandOptionType } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Load extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'load',
            description: {
                content: '載入播放列表',
                examples: ['load <playlist>'],
                usage: 'load <playlist>',
            },
            category: 'playlist',
            aliases: [],
            cooldown: 3,
            args: true,
            player: {
                voice: true,
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
                    description: '您要載入的播放列表',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        let player = client.queue.get(ctx.guild.id);
        const playlist = args.join(' ').replace(/\s/g, '');
        const playlistData = await client.db.getPLaylist(ctx.author.id, playlist);
        if (!playlistData)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '該播放清單不存在',
                        color: client.color.red,
                    },
                ],
            });
        const songs = await client.db.getSong(ctx.author.id, playlist);
        if (!songs.length)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: 'That playlist is empty',
                        color: client.color.red,
                    },
                ],
            });
        songs.map(async (s) => {
            for await (const song of JSON.parse(s.track)) {
                const vc = ctx.member as any;
                if (!player)
                    player = await client.queue.create(
                        ctx.guild,
                        vc.voice.channel,
                        ctx.channel,
                        client.shoukaku.options.nodeResolver(client.shoukaku.nodes)
                    );

                const track = player.buildTrack(song, ctx.author as any);
                player.queue.push(track);
                player.isPlaying();
            }

            return await ctx.sendMessage({
                embeds: [
                    {
                        description: `載入了 \`${playlistData.name}\` 包含 \`${JSON.parse(s.track).length}\` 首歌曲`,
                        color: client.color.main,
                    },
                ],
            });
        });
    }
}
