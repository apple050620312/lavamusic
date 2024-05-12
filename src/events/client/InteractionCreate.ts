import {
    AutocompleteInteraction,
    ChannelType,
    Collection,
    CommandInteraction,
    GuildMember,
    InteractionType,
    PermissionFlagsBits,
} from 'discord.js';
import { LoadType } from 'shoukaku';

import { Context, Event, Lavamusic } from '../../structures/index.js';

export default class InteractionCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'interactionCreate',
        });
    }
    public async run(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> {
        if (
            interaction instanceof CommandInteraction &&
            interaction.type === InteractionType.ApplicationCommand
        ) {
             const setup = await this.client.db.getSetup(interaction.guildId);
                    if (
                        setup &&
                        interaction.channelId === setup.textId 
                    ) { 
return interaction.reply({ content: `You can't use commands in setup channel.` , ephemeral: true})
                    }
            const { commandName } = interaction;
            await this.client.db.get(interaction.guildId); // get or create guild data
            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;
            const ctx = new Context(interaction as any, interaction.options.data as any);
            ctx.setArgs(interaction.options.data as any);
            if (
                !interaction.inGuild() ||
                !interaction.channel
                    .permissionsFor(interaction.guild.members.me)
                    .has(PermissionFlagsBits.ViewChannel)
            )
                return;

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
                return await (interaction.member as GuildMember)
                    .send({
                        content: `我在 \`${interaction.guild.name}\` 中沒有 **\`SendMessage\`** 權限\n頻道：<#${interaction.channelId}>`,
                    })
                    .catch(() => { });
            }

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks))
                return await interaction.reply({
                    content: '我沒有 **`EmbedLinks`** 權限。',
                });

            if (command.permissions) {
                if (command.permissions.client) {
                    if (!interaction.guild.members.me.permissions.has(command.permissions.client))
                        return await interaction.reply({
                            content: '我沒有足夠的權限來執行此指令。',
                        });
                }

                if (command.permissions.user) {
                    if (
                        !(interaction.member as GuildMember).permissions.has(
                            command.permissions.user
                        )
                    ) {
                        await interaction.reply({
                            content: '您沒有足夠的權限來使用此指令。',
                            ephemeral: true,
                        });
                        return;
                    }
                }
                if (command.permissions.dev) {
                    if (this.client.config.owners) {
                        const findDev = this.client.config.owners.find(
                            x => x === interaction.user.id
                        );
                        if (!findDev) return;
                    }
                }
            }
            if (command.player) {
                if (command.player.voice) {
                    if (!(interaction.member as GuildMember).voice.channel)
                        return await interaction.reply({
                            content: `您必須連接到語音頻道才能使用此 “${command.name}” 指令。`,
                        });

                    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Speak))
                        return await interaction.reply({
                            content: `我沒有 “連接” 權限來執行此 “${command.name}” 指令。`,
                        });

                    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Speak))
                        return await interaction.reply({
                            content: `我沒有 “說話” 權限來執行此 “${command.name}” 指令。`,
                        });

                    if (
                        (interaction.member as GuildMember).voice.channel.type ===
                        ChannelType.GuildStageVoice &&
                        !interaction.guild.members.me.permissions.has(
                            PermissionFlagsBits.RequestToSpeak
                        )
                    )
                        return await interaction.reply({
                            content: `我沒有 “請求發言” 權限來執行此 “${command.name}” 指令。`,
                        });
                    if (interaction.guild.members.me.voice.channel) {
                        if (
                            interaction.guild.members.me.voice.channelId !==
                            (interaction.member as GuildMember).voice.channelId
                        )
                            return await interaction.reply({
                                content: `您未連接到 <#${interaction.guild.members.me.voice.channel.id}> 來使用此 \`${command.name}\` 指令。`,
                            });
                    }
                }
                if (command.player.active) {
                    if (!this.client.queue.get(interaction.guildId))
                        return await interaction.reply({
                            content: '現在沒有播放任何內容。',
                        });
                    if (!this.client.queue.get(interaction.guildId).queue)
                        return await interaction.reply({
                            content: '現在沒有播放任何內容。',
                        });
                    if (!this.client.queue.get(interaction.guildId).current)
                        return await interaction.reply({
                            content: '現在沒有播放任何內容。',
                        });
                }
                if (command.player.dj) {
                    const dj = await this.client.db.getDj(interaction.guildId);
                    if (dj && dj.mode) {
                        const djRole = await this.client.db.getRoles(interaction.guildId);
                        if (!djRole)
                            return await interaction.reply({
                                content: '未設定 DJ 身分組。',
                            });
                        const findDJRole = (interaction.member as GuildMember).roles.cache.find(
                            (x: any) => djRole.map((y: any) => y.roleId).includes(x.id)
                        );
                        if (!findDJRole) {
                            if (
                                !(interaction.member as GuildMember).permissions.has(
                                    PermissionFlagsBits.ManageGuild
                                )
                            ) {
                                return await interaction.reply({
                                    content: '您需要擁有 DJ 身分組才能使用此指令。',
                                    ephemeral: true,
                                });
                            }
                        }
                    }
                }
            }
            if (!this.client.cooldown.has(commandName)) {
                this.client.cooldown.set(commandName, new Collection());
            }
            const now = Date.now();
            const timestamps = this.client.cooldown.get(commandName);

            const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
            if (!timestamps.has(interaction.user.id)) {
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            } else {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                const timeLeft = (expirationTime - now) / 1000;
                if (now < expirationTime && timeLeft > 0.9) {
                    return await interaction.reply({
                        content: `請等待 ${timeLeft.toFixed(
                            1
                        )} 秒再重新使用 \`${commandName}\` 指令。`,
                    });
                }
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            }
            if (
                interaction.options.data.some(
                    option => option.value && option.value.toString().includes('@everyone')
                ) ||
                interaction.options.data.some(
                    option => option.value && option.value.toString().includes('@here')
                )
            )
                return await interaction.reply({
                    content: '你不能提及 everyone 或 here。',
                    ephemeral: true,
                });
            try {
                await command.run(this.client, ctx, ctx.args);
            } catch (error) {
                this.client.logger.error(error);
                await interaction.reply({ content: `發生錯誤：\`${error}\`` });
            }
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            if ((interaction.commandName == 'play') || (interaction.commandName == 'playnext')) {
                const song = interaction.options.getString('song');
                const res = await this.client.queue.search(song);
                let songs = [];
                switch (res.loadType) {
                    case LoadType.SEARCH:
                        if (!res.data.length) return;
                        res.data.slice(0, 10).forEach(x => {
                            songs.push({
                                name: `${x.info.title} by ${x.info.author}`,
                                value: x.info.uri,
                            });
                        });
                        break;
                    default:
                        break;
                }

                return await interaction.respond(songs).catch(() => { });
            }
        }
    }
}

/**
 * Project: lavamusic
 * user: Blacky
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
