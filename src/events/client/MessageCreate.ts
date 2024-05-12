import { ChannelType, Collection, Message, PermissionFlagsBits } from 'discord.js';

import { Context, Event, Lavamusic } from '../../structures/index.js';

export default class MessageCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'messageCreate',
        });
    }
    public async run(message: Message): Promise<any> {
        if (message.author.bot) return;
        const setup = await this.client.db.getSetup(message.guildId);
        if (setup && setup.textId) {
            if (setup.textId === message.channelId) {
                return this.client.emit('setupSystem', message);
            }
        }
        let guild = await this.client.db.get(message.guildId);

        const mention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            await message.reply({
                content: `我在此伺服器的前綴是 \`${prefix.prefix}\`\n想瞭解更多請使用 \`${prefix.prefix}help\``,
            });
            return;
        }
        const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp(
            `^(<@!?${this.client.user.id}>|${escapeRegex(guild.prefix)})\\s*`
        );
        if (!prefixRegex.test(message.content)) return;
        const [matchedPrefix] = message.content.match(prefixRegex);

        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);

        const cmd = args.shift().toLowerCase();
        const command =
            this.client.commands.get(cmd) ||
            this.client.commands.get(this.client.aliases.get(cmd) as string);
        if (!command) return;
        const ctx = new Context(message, args);
        ctx.setArgs(args);

        let dm = message.author.dmChannel;
        if (typeof dm === 'undefined') dm = await message.author.createDM();

        if (
            !message.inGuild() ||
            !message.channel
                .permissionsFor(message.guild.members.me)
                .has(PermissionFlagsBits.ViewChannel)
        )
            return;

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages))
            return await message.author
                .send({
                    content: `我在 \`${message.guild.name}\` 中沒有 **\`傳送訊息\`** 權限\n頻道：<#${message.channelId}>`,
                })
                .catch(() => { });

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))
            return await message.reply({
                content: '我沒有 **`嵌入連結`** 權限。',
            });

        if (command.permissions) {
            if (command.permissions.client) {
                if (!message.guild.members.me.permissions.has(command.permissions.client))
                    return await message.reply({
                        content: '我沒有足夠的權限來執行此指令。',
                    });
            }

            if (command.permissions.user) {
                if (!message.member.permissions.has(command.permissions.user))
                    return await message.reply({
                        content: '您沒有足夠的權限來使用此指令。',
                    });
            }
            if (command.permissions.dev) {
                if (this.client.config.owners) {
                    const findDev = this.client.config.owners.find(x => x === message.author.id);
                    if (!findDev) return;
                }
            }
        }
        if (command.player) {
            if (command.player.voice) {
                if (!message.member.voice.channel)
                    return await message.reply({
                        content: `您必須連接到語音頻道才能使用此 “${command.name}” 指令。`,
                    });

                if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Speak))
                    return await message.reply({
                        content: `我沒有 “連接” 權限來執行此 “${command.name}” 指令。`,
                    });

                if (!message.guild.members.me.permissions.has(PermissionFlagsBits.Speak))
                    return await message.reply({
                        content: `我沒有 “說話” 權限來執行此 “${command.name}” 指令。`,
                    });

                if (
                    message.member.voice.channel.type === ChannelType.GuildStageVoice &&
                    !message.guild.members.me.permissions.has(PermissionFlagsBits.RequestToSpeak)
                )
                    return await message.reply({
                        content: `我沒有 “請求發言” 權限來執行此 “${command.name}” 指令。`,
                    });

                if (message.guild.members.me.voice.channel) {
                    if (message.guild.members.me.voice.channelId !== message.member.voice.channelId)
                        return await message.reply({
                            content: `您未連接到 <#${message.guild.members.me.voice.channel.id}> 來使用此 \`${command.name}\` 指令。`,
                        });
                }
            }
            if (command.player.active) {
                if (!this.client.queue.get(message.guildId))
                    return await message.reply({
                        content: '現在沒有播放任何內容。',
                    });
                if (!this.client.queue.get(message.guildId).queue)
                    return await message.reply({
                        content: '現在沒有播放任何內容。',
                    });
                if (!this.client.queue.get(message.guildId).current)
                    return await message.reply({
                        content: '現在沒有播放任何內容。',
                    });
            }
            if (command.player.dj) {
                const dj = await this.client.db.getDj(message.guildId);
                if (dj && dj.mode) {
                    const djRole = await this.client.db.getRoles(message.guildId);
                    if (!djRole)
                        return await message.reply({
                            content: '未設定 DJ 身分組。',
                        });
                    const findDJRole = message.member.roles.cache.find((x: any) =>
                        djRole.map((y: any) => y.roleId).includes(x.id)
                    );
                    if (!findDJRole) {
                        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                            return await message
                                .reply({
                                    content: '您需要擁有 DJ 身分組才能使用此指令。',
                                })
                                .then(msg => setTimeout(() => msg.delete(), 5000));
                        }
                    }
                }
            }
        }
        if (command.args) {
            if (!args.length) {
                const embed = this.client
                    .embed()
                    .setColor(this.client.color.red)
                    .setTitle('缺少參數')
                    .setDescription(
                        `請提供 \`${command.name
                        }\` 指令所需的參數。\n\n範例：\n${command.description.examples
                            ? command.description.examples.join('\n')
                            : 'None'
                        }`
                    )
                    .setFooter({ text: '語法：[] = 可選，<> = 必需' });
                return await message.reply({ embeds: [embed] });
            }
        }

        if (!this.client.cooldown.has(cmd)) {
            this.client.cooldown.set(cmd, new Collection());
        }
        const now = Date.now();
        const timestamps = this.client.cooldown.get(cmd);

        const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        } else {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            const timeLeft = (expirationTime - now) / 1000;
            if (now < expirationTime && timeLeft > 0.9) {
                return await message.reply({
                    content: `請等待 ${timeLeft.toFixed(
                        1
                    )} 秒再重新使用 \`${cmd}\` 指令。`,
                });
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        if (args.includes('@everyone') || args.includes('@here'))
            return await message.reply({
                content: '您不能將此指令與 everyone 或 here 一起使用。',
            });

        try {
            return command.run(this.client, ctx, ctx.args);
        } catch (error) {
            this.client.logger.error(error);
            await message.reply({ content: `發生錯誤：\`${error}\`` });
            return;
        }
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
