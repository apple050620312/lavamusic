import { Message, PermissionsBitField, TextChannel } from 'discord.js';

import { Event, Lavamusic } from '../../structures/index.js';
import { oops, setupStart } from '../../utils/SetupSystem.js';

export default class SetupSystem extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'setupSystem',
        });
    }
    public async run(message: Message): Promise<void> {
        let channel = message.channel as any;

        if (!(channel instanceof TextChannel)) return;
        if (!message.member.voice.channel) {
            await oops(channel, `您未連接到語音頻道來點歌。`);
            if (message) await message.delete().catch(() => {});
            return;
        }

        if (
            !message.member.voice.channel
                .permissionsFor(this.client.user)
                .has(PermissionsBitField.resolve(['Connect', 'Speak']))
        ) {
            await oops(
                channel,
                `我沒有足夠的權限在 <#${message.member.voice.channel.id}> 連接/說話`
            );
            if (message) await message.delete().catch(() => {});
            return;
        }

        if (
            message.guild.members.cache.get(this.client.user.id).voice.channel &&
            message.guild.members.cache.get(this.client.user.id).voice.channelId !==
                message.member.voice.channelId
        ) {
            await oops(
                channel,
                `您未連接到 <#${
                    message.guild.members.cache.get(this.client.user.id).voice.channelId
                }> 來點歌`
            );
            if (message) await message.delete().catch(() => {});
            return;
        }
        let player = this.client.queue.get(message.guildId);
        if (!player) {
            player = await this.client.queue.create(
                message.guild,
                message.member.voice.channel,
                message.channel,
                this.client.shoukaku.options.nodeResolver(this.client.shoukaku.nodes)
            );
        }
        await setupStart(this.client, message.content, player, message);
        if (message) await message.delete().catch(() => {});
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
