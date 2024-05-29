import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class About extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'about',
            description: {
                content: '顯示有​​關機器人的信息',
                examples: ['about'],
                usage: 'about',
            },
            category: 'info',
            aliases: ['ab'],
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
        const inviteButton = new ButtonBuilder()
            .setLabel('邀請機器人')
            .setStyle(ButtonStyle.Link)
            .setURL(
                `https://discord.com/api/oauth2/authorize?client_id=${client.config.clientId}&permissions=-1&scope=bot%20applications.commands`
            );

        const supportButton = new ButtonBuilder()
            .setLabel('Coffee Host')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/2vA8ms9X7y');

        const row = new ActionRowBuilder().addComponents(inviteButton, supportButton);

        const embed = this.client
            .embed()
            .setAuthor({
                name: '岩漿音樂機器人',
                iconURL:
                    'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png',
            })
            .setThumbnail(
                'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png'
            )
            .setColor(this.client.color.main)
            .addFields(
                {
                    name: '擁有者',
                    value: '<@523114942434639873>',
                    inline: true,
                },
                {
                    name: 'Github',
                    value: '[倉庫](https://github.com/appujet/lavamusic)',
                    inline: true,
                },
                {
                    name: 'Coffee Host',
                    value: '[加入社群](https://discord.gg/2vA8ms9X7y)',
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: `這邊還沒想好要寫什麼`,
                    inline: true,
                }
            );

        await ctx.sendMessage({
            content: '',
            embeds: [embed],
            components: [row],
        });
    }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
