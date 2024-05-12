import { Lavamusic } from '../../structures/index.js';
import { BotPlugin } from '../index.js';

const antiCrash: BotPlugin = {
    name: 'AntiCrash Plugin',
    version: '1.0.0',
    author: 'Blacky',
    initialize: (client: Lavamusic) => {
        process.on('unhandledRejection', (reason, promise) => {
            client.logger.error('未處理的拒絕：', promise, 'reason:', reason);
        });
        process.on('uncaughtException', err => {
            client.logger.error('拋出未捕獲的例外：', err);
        });

        const handleExit = async (): Promise<void> => {
            if (client) {
                client.logger.star('正在斷開與 Discord 的連線...');
                await client.destroy();
                client.logger.success('已成功斷開與 Discord 的連線！');
                process.exit();
            }
        };
        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);
        process.on('SIGQUIT', handleExit);
    },
};

export default antiCrash;
