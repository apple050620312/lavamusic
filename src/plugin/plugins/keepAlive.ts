import http from 'node:http';

import { Lavamusic } from '../../structures/index.js';
import { BotPlugin } from '../index.js';

const keepAlive: BotPlugin = {
    name: 'KeepAlive Plugin',
    version: '1.0.0',
    author: 'Appu',
    initialize: (client: Lavamusic) => {
        if (client.config.keepAlive) {
            const server = http.createServer((req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`我還活著！目前為 ${client.guilds.cache.size} 個伺服器提供服務。`);
            });

            server.listen(3000, () => {
                client.logger.info('Keep-Alive 伺服器在連接埠 3000 上運行');
            });
        }
    },
};

export default keepAlive;

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
