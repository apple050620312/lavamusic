import { version } from 'discord.js';
import os from 'node:os';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Info extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'info',
            description: {
                content: '有關機器人的資訊',
                examples: ['info'],
                usage: 'info',
            },
            category: 'info',
            aliases: ['botinfo', 'bi'],
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
        const osType = os.type();
        const osRelease = os.release();
        const osUptime = os.uptime();
        const osHostname = os.hostname();
        const cpuArch = os.arch();
        const cpuCores = os.cpus().length;
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const nodeVersion = process.version;
        const discordJsVersion = version;
        const botGuilds = client.guilds.cache.size;
        const botChannels = client.channels.cache.size;
        const botUsers = client.users.cache.size;
        const botCommands = client.commands.size;

        const botInfo = `機器人資訊：
- **作業系統**: ${osType} ${osRelease}
- **上線時間**: ${client.utils.formatTime(osUptime)}
- **主機名稱**: ${osHostname}
- **CPU 架構**: ${cpuArch} (${cpuCores} 核)
- **記憶體用量**: ${client.utils.formatBytes(usedMem)} / ${client.utils.formatBytes(
            totalMem
        )} (${Math.round((usedMem / totalMem) * 100)}%)
- **Node.js 版本**: ${nodeVersion}
- **Discord.js 版本**: ${discordJsVersion}
- **已連接** ${botGuilds} 個伺服器、${botChannels} 個頻道和 ${botUsers} 個用戶
- **總指令數**: ${botCommands}
  `;

        const embed = this.client.embed();
        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(botInfo)],
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
