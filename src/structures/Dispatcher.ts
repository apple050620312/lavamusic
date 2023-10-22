/* eslint-disable @typescript-eslint/typedef */
import { Message, User } from 'discord.js';
import { Node, Player, Track } from 'shoukaku';

import { Lavamusic } from './index';

export class Song implements Track {
    track: string;
    info: {
        identifier: string;
        isSeekable: boolean;
        author: string;
        length: number;
        isStream: boolean;
        position: number;
        title: string;
        uri: string;
        sourceName: string;
        thumbnail?: string;
        requester?: User;
    };
    constructor(track: Song, user: User) {
        if (!track) throw new Error('Track is not provided');
        this.track = track.track;
        this.info = track.info;
        if (this.info && this.info.requester === undefined) this.info.requester = user;
        if (track.info.sourceName === 'youtube') {
            track.info.thumbnail = `https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`;
        }
    }
}
export default class Dispatcher {
    private client: Lavamusic;
    public guildId: string;
    public channelId: string;
    public player: Player;
    public queue: Song[];
    public stopped: boolean;
    public previous: Song | null;
    public current: Song | null;
    public loop: 'off' | 'repeat' | 'queue';
    public matchedTracks: Song[];
    public requester: User;
    public repeat: number;
    public node: Node;
    public shuffle: boolean;
    public paused: boolean;
    public filters: Array<string>;
    public autoplay: boolean;
    public nowPlayingMessage: Message | null;
    public history: Song[] = [];

    constructor(options: DispatcherOptions) {
        this.client = options.client;
        this.guildId = options.guildId;
        this.channelId = options.channelId;
        this.player = options.player;
        this.queue = [];
        this.stopped = false;
        this.previous = null;
        this.current = null;
        this.loop = 'off';
        this.matchedTracks = [];
        this.repeat = 0;
        this.node = options.node;
        this.shuffle = false;
        this.paused = false;
        this.filters = [];
        this.autoplay = false;
        this.nowPlayingMessage = null;

        this.player
            .on('start', () =>
                this.client.shoukaku.emit('trackStart', this.player, this.current, this)
            )
            .on('end', () => {
                if (!this.queue.length)
                    this.client.shoukaku.emit('queueEnd', this.player, this.current, this);
                this.client.shoukaku.emit('trackEnd', this.player, this.current, this);
            })
            .on('stuck', () => this.client.shoukaku.emit('trackStuck', this.player, this.current))
            .on('closed', (...arr) => {
                this.client.shoukaku.emit('socketClosed', this.player, ...arr);
            });
    }

    get exists(): boolean {
        return this.client.queue.has(this.guildId);
    }
    get volume(): number {
        return this.player.filters.volume;
    }
    public async play(): Promise<void> {
        if (!this.exists || (!this.queue.length && !this.current)) {
            return;
        }
        this.current = this.queue.length !== 0 ? this.queue.shift() : this.queue[0];
        if (this.matchedTracks.length !== 0) this.matchedTracks = [];
        const search = (await this.node.rest.resolve(
            `${this.client.config.searchEngine}:${this.current?.info.title} ${this.current?.info.author}`
        )) as any;
        this.matchedTracks.push(...search.tracks);
        this.player.playTrack({ track: this.current?.track });
        if (this.current) {
            this.history.push(this.current);
            if (this.history.length > 100) {
                this.history.shift();
            }
        }
    }
    public pause(): void {
        if (!this.player) return;
        if (!this.paused) {
            this.player.setPaused(true);
            this.paused = true;
        } else {
            this.player.setPaused(false);
            this.paused = false;
        }
    }
    public remove(index: number): void {
        if (!this.player) return;
        if (index > this.queue.length) return;
        this.queue.splice(index, 1);
    }
    public previousTrack(): void {
        if (!this.player) return;
        if (!this.previous) return;
        this.queue.unshift(this.previous);
        this.player.stopTrack();
    }
    public destroy(): void {
        this.queue.length = 0;
        this.history = [];
        this.player.connection.disconnect();
        this.client.queue.delete(this.guildId);
        if (this.stopped) return;
        this.client.shoukaku.emit('playerDestroy', this.player);
    }
    public setShuffle(shuffle: boolean): void {
        if (!this.player) return;
        this.shuffle = shuffle;
        if (shuffle) {
            const current = this.queue.shift();
            this.queue = this.queue.sort(() => Math.random() - 0.5);
            this.queue.unshift(current);
        } else {
            const current = this.queue.shift();
            this.queue = this.queue.sort((a: any, b: any) => a - b);
            this.queue.unshift(current);
        }
    }
    public async skip(skipto = 1): Promise<void> {
        if (!this.player) return;
        if (skipto > 1) {
            this.queue.unshift(this.queue[skipto - 1]);
            this.queue.splice(skipto, 1);
        }
        this.repeat = this.repeat == 1 ? 0 : this.repeat;
        this.player.stopTrack();
    }
    public seek(time: number): void {
        if (!this.player) return;
        this.player.seekTo(time);
    }
    public stop(): void {
        if (!this.player) return;
        this.queue.length = 0;
        this.history = [];
        this.loop = 'off';
        this.autoplay = false;
        this.repeat = 0;
        this.stopped = true;
        this.player.stopTrack();
        this.player.connection.disconnect();
    }
    public setLoop(loop: any): void {
        this.loop = loop;
    }

    public buildTrack(track: Song, user: User): Song {
        return new Song(track, user);
    }
    public async isPlaying(): Promise<void> {
        if (this.queue.length && !this.current && !this.player.paused) {
            this.play();
        }
    }
    public async Autoplay(song: Song): Promise<void> {
        const resolve = await this.node.rest.resolve(
            `${this.client.config.searchEngine}:${song.info.author}`
        );
        if (!resolve || !resolve.tracks.length) return this.destroy();

        let choosed: Song | null = null;
        const maxAttempts = 10; // Maximum number of attempts to find a unique song
        let attempts = 0;

        while (attempts < maxAttempts) {
            const potentialChoice = new Song(
                resolve.tracks[Math.floor(Math.random() * resolve.tracks.length)],
                this.client.user
            );

            // Check if the chosen song is not already in the queue or history
            if (
                !this.queue.some(s => s.track === potentialChoice.track) &&
                !this.history.some(s => s.track === potentialChoice.track)
            ) {
                choosed = potentialChoice;
                break;
            }

            attempts++;
        }

        if (choosed) {
            this.queue.push(choosed);
            return await this.isPlaying();
        }
        return this.destroy();
    }
    public async setAutoplay(autoplay: boolean): Promise<void> {
        this.autoplay = autoplay;
        if (autoplay) {
            this.Autoplay(this.current ? this.current : this.queue[0]);
        }
    }
}

export interface DispatcherOptions {
    client: Lavamusic;
    guildId: string;
    channelId: string;
    player: Player;
    node: Node;
}

/**
 * Project: lavamusic
 * Author: Blacky
 * Company: Coders
 * Copyright (c) 2023. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
