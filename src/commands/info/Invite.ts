import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Invite extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'invite',
            description: {
                content: '發送機器人的邀請連結',
                examples: ['invite'],
                usage: 'invite',
            },
            category: 'info',
            aliases: ['inv'],
            cooldown: 3,
            args: false,
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
            options: [],
        });
    }
    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const clientId = process.env.CLIENT_ID;
        if (!clientId) {
            console.error(
                '在環境變數中找不到客戶端 ID，無法產生邀請連結。'
            );
            return await ctx.sendMessage(
                '抱歉，我的邀請連結目前不可用。請告訴機器人開發人員檢查他們的控制台。'
            );
        }

        const embed = this.client.embed();
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('邀請我')
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=-1&scope=bot%20applications.commands`
                ),
            new ButtonBuilder()
                .setLabel('Coffee Host')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/2vA8ms9X7y')
        );

        return await ctx.sendMessage({
            embeds: [
                embed
                    .setColor(this.client.color.main)
                    .setDescription(
                        `您可以點擊下面的按鈕邀請我。有任何錯誤或下線嗎？加入支援伺服器！`
                    ),
            ],
            components: [row],
        });
    }
}
