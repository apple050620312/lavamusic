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
        this.client.logger.error(`節點 ${node} 被破壞，代號為 ${code}，原因為 ${reason}`);
        BotLog.send(
            this.client,
            `節點 ${node} 被破壞，代號為 ${code}，原因為 ${reason}`,
            'error'
        );
        destroyCount++;
        if (destroyCount >= 5) {
            this.client.shoukaku.removeNode(node);
            destroyCount = 0;
            this.client.logger.warn(`由於過度斷開連接，節點 ${node} 從節點列表中刪除`);
            BotLog.send(
                this.client,
                `由於過度斷開連接，節點 ${node} 從節點列表中刪除`,
                'warn'
            );
        }
    }
}
