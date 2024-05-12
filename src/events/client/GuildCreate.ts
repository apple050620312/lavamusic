import { EmbedBuilder, Guild, GuildMember, TextChannel } from 'discord.js';

import { Event, Lavamusic } from '../../structures/index.js';

export default class GuildCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'guildCreate',
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
            .setColor(this.client.config.color.green)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ extension: 'jpeg' }) })
            .setDescription(`**${guild.name}** 已加入我的伺服器列表！`)
            .setThumbnail(guild.iconURL({ extension: 'jpeg' }))
            .addFields(
                { name: '擁有者', value: owner.user.tag, inline: true },
                { name: '成員', value: guild.memberCount.toString(), inline: true },
                {
                    name: '創建於',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                    inline: true,
                },
                {
                    name: '加入於',
                    value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:F>`,
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
