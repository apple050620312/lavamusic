import { ApplicationCommandOptionType } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Pitch extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'pitch',
            description: {
                content: '開啟/關閉音高濾波器',
                examples: ['pitch 1'],
                usage: 'pitch <number>',
            },
            category: 'filters',
            aliases: ['ph'],
            cooldown: 3,
            args: true,
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
            options: [
                {
                    name: 'number',
                    description: '您想要設定音高的數字',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild.id);

        const number = Number(args[0]);
        if (isNaN(number))
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '請提供有效數字',
                        color: client.color.red,
                    },
                ],
            });
        if (number > 5 || number < 1)
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: '請提供 1 到 5 之間的數字',
                        color: client.color.red,
                    },
                ],
            });
        player.player.setTimescale({ pitch: number, rate: 1, speed: 1 });

        return await ctx.sendMessage({
            embeds: [
                {
                    description: `音高已設定為 ${number}`,
                    color: client.color.main,
                },
            ],
        });
    }
}
