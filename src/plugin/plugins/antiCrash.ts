import { Lavamusic } from '../../structures/index.js';
import { BotPlugin } from '../index.js';

const antiCrash: BotPlugin = {
    name: 'AntiCrash Plugin',
    version: '1.0.0',
    author: 'Appu',
    initialize: (client: Lavamusic) => {
        const handleExit = async (): Promise<void> => {
            if (client) {
                client.logger.star('正在斷開與 Discord 的連線...');
                await client.destroy();
                client.logger.success('已成功斷開與 Discord 的連線！');
                process.exit();
            }
        };

        process.on('unhandledRejection', (reason, promise) => {
            client.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', err => {
            client.logger.error('Uncaught Exception thrown:', err);
        });

        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);
        process.on('SIGQUIT', handleExit);
    },
};

export default antiCrash;

/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
