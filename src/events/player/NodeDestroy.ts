import { Event, Lavamusic } from '../../structures/index.js';
import BotLog from '../../utils/BotLog.js';

let destroyCount = 0;

export default class NodeDestroy extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'nodeDestroy',
        });
    }

    public async run(node: string, code: number, reason: string): Promise<void> {
        const message = `節點 ${node} 被破壞，代號為 ${code}，原因為 ${reason}`;

        this.client.logger.error(message);
        BotLog.send(this.client, message, 'error');

        destroyCount++;

        if (destroyCount >= 5) {
            this.client.shoukaku.removeNode(node);
            destroyCount = 0;

            const warnMessage = `由於過度斷開連接，節點 ${node} 從節點列表中刪除`;

            this.client.logger.warn(warnMessage);
            BotLog.send(this.client, warnMessage, 'warn');
        }
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
