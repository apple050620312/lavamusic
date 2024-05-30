import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Grab extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'grab',
            description: {
                content: '抓取目前正在播放的歌曲',
                examples: ['grab'],
                usage: 'grab',
            },
            category: 'music',
            aliases: [],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: true,
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
        const embed = client.embed().setColor(client.color.main);
        let player = client.queue.get(ctx.guild.id);
        let song = player.current;

        try {
            const dm = client
                .embed()
                .setTitle(`**${song.info.title}**`)
                .setURL(song.info.uri)
                .setThumbnail(song.info.artworkUrl)
                .setDescription(
                    `**長度：** ${
                        song.info.isStream ? '直播' : client.utils.formatTime(song.info.length)
                    }\n**請求者：** ${song.info.requester}\n**連結：** [點我](${
                        song.info.uri
                    })`
                )
                .setColor(client.color.main);
            await ctx.author.send({ embeds: [dm] });
            return await ctx.sendMessage({
                embeds: [embed.setDescription(`**我私訊你了。**`).setColor(client.color.green)],
            });
        } catch (e) {
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setDescription(`**我沒辦法私訊你。**`)
                        .setColor(client.color.red),
                ],
            });
        }
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
