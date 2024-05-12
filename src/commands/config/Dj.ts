import { ApplicationCommandOptionType } from 'discord.js';

import { Command, Context, Lavamusic } from '../../structures/index.js';

export default class Dj extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: 'dj',
            description: {
                content: '管理 DJ 模式和相關身分組',
                examples: ['dj add @role', 'dj remove @role', 'dj clear', 'dj toggle'],
                usage: 'dj',
            },
            category: 'general',
            aliases: ['dj'],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
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
                    name: 'add',
                    description: '您要新增的 DJ 身分組',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'role',
                            description: '您要新增的 DJ 身分組',
                            type: ApplicationCommandOptionType.Role,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: '您要刪除的 DJ 身分組',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'role',
                            description: '您要刪除的 DJ 身分組',
                            type: ApplicationCommandOptionType.Role,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'clear',
                    description: '清除所有 DJ 身分組',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: 'toggle',
                    description: '切換 DJ 身分組',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
        });
    }
    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        let subCommand: string;
        let role: any;
        if (ctx.isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            if (subCommand === 'add' || subCommand === 'remove') {
                role = ctx.interaction.options.data[0].options[0].role;
            }
        } else {
            subCommand = args[0];
            role = ctx.message.mentions.roles.first() || ctx.guild.roles.cache.get(args[1]);
        }
        const embed = client.embed().setColor(client.color.main);
        let dj = await client.db.getDj(ctx.guild.id);
        if (subCommand === 'add') {
            if (!role)
                return await ctx.sendMessage({
                    embeds: [embed.setDescription('請提供要新增的身分組')],
                });
            const isExRole = await client.db
                .getRoles(ctx.guild.id)
                .then((r) => r.find((re) => re.roleId === role.id));
            if (isExRole)
                return await ctx.sendMessage({
                    embeds: [embed.setDescription(`DJ 身分組 <@&${role.id}> 已經新增過了`)],
                });
            client.db.addRole(ctx.guild.id, role.id);
            client.db.setDj(ctx.guild.id, true);
            return await ctx.sendMessage({
                embeds: [embed.setDescription(`已新增 DJ 身分組 <@&${role.id}>`)],
            });
        } else if (subCommand === 'remove') {
            if (!role)
                return await ctx.sendMessage({
                    embeds: [embed.setDescription('請提供要刪除的身分組')],
                });
            const isExRole = await client.db
                .getRoles(ctx.guild.id)
                .then((r) => r.find((re) => re.roleId === role.id));
            if (!isExRole)
                return await ctx.sendMessage({
                    embeds: [embed.setDescription(`尚未新增過 DJ 身分組 <@&${role.id}>`)],
                });
            client.db.removeRole(ctx.guild.id, role.id);
            return await ctx.sendMessage({
                embeds: [embed.setDescription(`DJ 身分組 <@&${role.id}> 已刪除`)],
            });
        } else if (subCommand === 'clear') {
            if (!dj)
                return await ctx.sendMessage({
                    embeds: [embed.setDescription('沒有可清除的 DJ 身分組')],
                });
            client.db.clearRoles(ctx.guild.id);
            return await ctx.sendMessage({
                embeds: [embed.setDescription(`所有 DJ 身分組已刪除`)],
            });
        } else if (subCommand === 'toggle') {
            if (!dj)
                return await ctx.sendMessage({
                    embeds: [embed.setDescription('沒有可供切換的 DJ 身分組')],
                });
            const data = await client.db.getDj(ctx.guild.id);
            if (data) {
                client.db.setDj(ctx.guild.id, !data.mode);
                return await ctx.sendMessage({
                    embeds: [
                        embed.setDescription(
                            `DJ 模式已切換至 ${!data.mode ? '啟用' : '停用'}`
                        ),
                    ],
                });
            }
        } else {
            return await ctx.sendMessage({
                embeds: [
                    embed.setDescription('請提供有效的副指令').addFields({
                        name: '副指令',
                        value: '`add`, `remove`, `clear`, `toggle`',
                    }),
                ],
            });
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
