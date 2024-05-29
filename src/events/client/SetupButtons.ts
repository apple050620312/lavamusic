import { Event, Lavamusic } from '../../structures/index.js';
import { getButtons } from '../../utils/Buttons.js';
import { buttonReply } from '../../utils/SetupSystem.js';
import { checkDj } from '../player/TrackStart.js';

export default class SetupButtons extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'setupButtons',
        });
    }
    public async run(interaction: any): Promise<void> {
        if (!interaction.replied) await interaction.deferReply().catch(() => {});

        if (!interaction.member.voice.channel)
            return await buttonReply(
                interaction,
                `您需要連接到語音通道才能使用此按鈕。`,
                this.client.color.red
            );
        if (
            interaction.guild.members.cache.get(this.client.user.id).voice.channel &&
            interaction.guild.members.cache.get(this.client.user.id).voice.channelId !==
                interaction.member.voice.channelId
        )
            return await buttonReply(
                interaction,
                `您需要連接到 ${interaction.guild.me.voice.channel} 來使用此按鈕。`,
                this.client.color.red
            );
        const player = this.client.queue.get(interaction.guildId);
        if (!player)
            return await buttonReply(
                interaction,
                `此伺服器中沒有播放音樂。`,
                this.client.color.red
            );
        if (!player.queue)
            return await buttonReply(
                interaction,
                `此伺服器中沒有播放音樂。`,
                this.client.color.red
            );
        if (!player.current)
            return await buttonReply(
                interaction,
                `此伺服器中沒有播放音樂。`,
                this.client.color.red
            );
        const data = await this.client.db.getSetup(interaction.guildId);
        const { title, uri, length } = player.current.info;
        let message;
        try {
            message = await interaction.channel.messages.fetch(data.messageId, { cache: true });
        } catch (e) {
            /* empty */
        }
        const icon = player
            ? player.current.info.artworkUrl
            : this.client.user.displayAvatarURL({ extension: 'png' });
        let iconUrl = this.client.config.icons[player.current.info.sourceName];
        if (!iconUrl) iconUrl = this.client.user.displayAvatarURL({ extension: 'png' });

        const embed = this.client
            .embed()
            .setAuthor({ name: `正在播放`, iconURL: iconUrl })
            .setColor(this.client.color.main)
            .setDescription(
                `[${title}](${uri}) - ${
                    player.current.info.isStream ? '直播' : this.client.utils.formatTime(length)
                } - 請求者：${player.current.info.requester}`
            )
            .setImage(icon);
        if (!interaction.isButton()) return;
        if (!(await checkDj(this.client, interaction))) {
            await buttonReply(
                interaction,
                `您需要擁有 DJ 身分組才能使用此指令。`,
                this.client.color.red
            );
            return;
        }
        if (message) {
            switch (interaction.customId) {
                case 'LOW_VOL_BUT': {
                    const vol = player.player.volume - 10;
                    player.player.setGlobalVolume(vol);
                    await buttonReply(interaction, `音量設定為 ${vol}%`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `音量：${vol}%`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case 'HIGH_VOL_BUT': {
                    const vol2 = player.player.volume + 10;
                    player.player.setGlobalVolume(vol2);
                    await buttonReply(
                        interaction,
                        `音量設定為 ${vol2}%`,
                        this.client.color.main
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `音量：${vol2}%`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case 'PAUSE_BUT': {
                    const name = player.player.paused ? `繼續` : `暫停`;
                    player.pause();
                    await buttonReply(interaction, `已 ${name} 播放音樂。`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `由 ${interaction.member.displayName} ${name}`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                        components: getButtons(player),
                    });
                    break;
                }
                case 'SKIP_BUT':
                    if (player.queue.length === 0)
                        return await buttonReply(
                            interaction,
                            `沒有可以跳過的音樂。`,
                            this.client.color.main
                        );
                    player.skip();
                    await buttonReply(interaction, `已跳過音樂。`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `由 ${interaction.member.displayName} 跳過`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                case 'STOP_BUT':
                    player.stop();
                    await buttonReply(interaction, `停止了音樂。`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed
                                .setFooter({
                                    text: `由 ${interaction.member.displayName} 停止`,
                                    iconURL: interaction.member.displayAvatarURL({}),
                                })
                                .setDescription(`現在沒有播放任何內容`)
                                .setImage(this.client.config.links.img)
                                .setAuthor({
                                    name: this.client.user.username,
                                    iconURL: this.client.user.displayAvatarURL({
                                        extension: 'png',
                                    }),
                                }),
                        ],
                    });
                    break;
                case 'LOOP_BUT': {
                    const loopOptions: Array<'off' | 'queue' | 'repeat'> = [
                        '關閉',
                        '隊列',
                        '單曲',
                    ];
                    const newLoop = loopOptions[Math.floor(Math.random() * loopOptions.length)];

                    if (player.loop === newLoop) {
                        await buttonReply(
                            interaction,
                            `循環模式已經是 ${player.loop}。`,
                            this.client.color.main
                        );
                    } else {
                        player.setLoop(newLoop);
                        await buttonReply(
                            interaction,
                            `循環模式設定為 ${player.loop}.`,
                            this.client.color.main
                        );
                        await message.edit({
                            embeds: [
                                embed.setFooter({
                                    text: `循環模式由 ${player.loop} 設定為 ${interaction.member.displayName}`,
                                    iconURL: interaction.member.displayAvatarURL({}),
                                }),
                            ],
                        });
                    }
                    break;
                }
                case 'SHUFFLE_BUT':
                    player.setShuffle();
                    await buttonReply(interaction, `已打亂隊列。`, this.client.color.main);
                    break;
                case 'PREV_BUT':
                    if (!player.previous)
                        return await buttonReply(
                            interaction,
                            `沒有上一首曲目。`,
                            this.client.color.main
                        );
                    player.previousTrack();
                    await buttonReply(
                        interaction,
                        `播放上一首曲目。`,
                        this.client.color.main
                    );
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `由 ${interaction.member.displayName} 上一首`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                case 'REWIND_BUT': {
                    const time = player.player.position - 10000;
                    if (time < 0)
                        return await buttonReply(
                            interaction,
                            `倒帶的長度不能超過歌曲的長度。`,
                            this.client.color.main
                        );
                    player.seek(time);
                    await buttonReply(interaction, `已倒帶歌曲。`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `由 ${interaction.member.displayName} 倒帶`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                case 'FORWARD_BUT': {
                    const time2 = player.player.position + 10000;
                    if (time2 > player.current.info.length)
                        return await buttonReply(
                            interaction,
                            `快進的長度不能超過歌曲的長度。`,
                            this.client.color.main
                        );
                    player.seek(time2);
                    await buttonReply(interaction, `已快進歌曲。`, this.client.color.main);
                    await message.edit({
                        embeds: [
                            embed.setFooter({
                                text: `由 ${interaction.member.displayName} 快進`,
                                iconURL: interaction.member.displayAvatarURL({}),
                            }),
                        ],
                    });
                    break;
                }
                default:
                    await buttonReply(
                        interaction,
                        `此按鈕不可用。`,
                        this.client.color.main
                    );
                    break;
            }
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
