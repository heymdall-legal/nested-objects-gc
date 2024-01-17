import * as http from 'node:http';
import { sleep } from './utils.mjs';

function allocateOneMB() {
    const oneMB = Buffer.alloc(1024 * 1024, 'a');
    return oneMB;
}

export function createServer() {
    const server = http.createServer(async (req, res) => {
        res.writeHead(200);
        const memory = [];
        for (let i = 0; i < 17; i++) {
            await sleep(10);
            memory.push(allocateOneMB());
        }
    
        res.end('Some memory were used');
    });
    
    return server;
}