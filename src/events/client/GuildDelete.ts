import { EmbedBuilder, Guild, GuildMember, TextChannel } from 'discord.js';

import { Event, Lavamusic } from '../../structures/index.js';

export default class GuildDelete extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'guildDelete',
        });
    }
    public async run(guild: Guild): Promise<any> {
        let owner: GuildMember | undefined;
        try {
            owner = guild.members.cache.get(guild?.ownerId);
        } catch (e) {
            owner = await guild.fetchOwner();
        }
        if (!owner) {
            owner = {
                user: {
                    tag: 'Unknown#0000',
                },
            } as GuildMember;
        }
        const embed = new EmbedBuilder()
            .setColor(this.client.config.color.red)
            .setAuthor({
                name: guild.name || 'Unknown Guild',
                iconURL: guild.iconURL({ extension: 'jpeg' }),
            })

            .setDescription(`**${guild.name}** 已從我的伺服器列表中移除！`)
            .setThumbnail(guild.iconURL({ extension: 'jpeg' }))
            .addFields(
                { name: '擁有者', value: owner.user.tag, inline: true },
                {
                    name: '成員',
                    value: guild.memberCount ? guild.memberCount.toString() : 'Unknown',
                    inline: true,
                },
                {
                    name: '創建於',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                    inline: true,
                },
                {
                    name: '移除於',
                    value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                    inline: true,
                },
                { name: 'ID', value: guild.id, inline: true }
            )
            .setTimestamp();
        const channel = (await this.client.channels.fetch(
            this.client.config.logChannelId
        )) as TextChannel;
        if (!channel) return;
        return await channel.send({ embeds: [embed] });
    }
}
