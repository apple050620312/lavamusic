import { version } from 'discord.js';
import { showTotalMemory, usagePercent } from 'node-system-stats';
import os from 'node:os';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Botinfo extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'botinfo',
            description: {
                content: '有關機器人的資訊',
                examples: ['botinfo'],
                usage: 'botinfo',
            },
            category: 'info',
            aliases: ['info', 'bi'],
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
        const osInfo = os.type() + ' ' + os.release();
        const osUptime = client.utils.formatTime(os.uptime());
        const osHostname = os.hostname();
        const cpuInfo = os.arch() + ' (' + os.cpus().length + ' cores)';
        const cpuUsed = (await usagePercent({ coreIndex: 0, sampleMs: 2000 })).percent;
        const memTotal = showTotalMemory(true);
        const memUsed = (process.memoryUsage().rss / 1024 ** 2).toFixed(2);
        const nodeVersion = process.version;
        const discordJsVersion = version;
        const guilds = client.guilds.cache.size;
        const channels = client.channels.cache.size;
        const users = client.users.cache.size;
        const commands = client.commands.size;

        const botInfo = `機器人資訊：
- **作業系統**: ${osInfo}
- **上線時間**: ${osUptime}
- **主機名稱**: ${osHostname}
- **CPU 架構**: ${cpuInfo}
- **CPU 用量**: ${cpuUsed}%
- **記憶體用量**: ${memUsed}MB / ${memTotal}GB
- **Node.js 版本**: ${nodeVersion}
- **Discord.js 版本**: ${discordJsVersion}
- **Connected to** ${guilds} guilds, ${channels} channels, and ${users} users
- **Total Commands**: ${commands}`;

        const embed = this.client.embed();
        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(botInfo)],
        });
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
