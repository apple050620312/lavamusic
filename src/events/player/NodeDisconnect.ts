import { Event, Lavamusic } from '../../structures/index.js';
import BotLog from '../../utils/BotLog.js';

export default class NodeDisconnect extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'nodeDisconnect',
        });
    }
    public async run(node: string, count: number): Promise<void> {
        this.client.logger.warn(`節點 ${node} 斷開連接 ${count} 次`);
        BotLog.send(this.client, `節點 ${node} 斷開連接 ${count} 次`, 'warn');
    }
}
