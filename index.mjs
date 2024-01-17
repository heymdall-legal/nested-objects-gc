import { startObserving, printStats } from './collect-gc-stats.mjs';
import * as objectGenerator from './objects-generator.mjs';
import { createServer } from './server.mjs';
import { load } from './generate-load.mjs';

import * as fs from 'node:fs';
import { createBunchOfNestedObjects } from './objects-generator.mjs';

const PORT = 3000;
const ITERATIONS = 100;

// Запускаем сбор статистики по работе GC
const counters = startObserving();
const printInterval = setInterval(() => printStats(counters), 500);

// Запускаем сервер
const server = createServer();
server.listen(PORT);

async function run() {
    // Генерируем нагрузку
    for (let i = 0; i < ITERATIONS; i++) {
        await load(`http://localhost:${PORT}`);
    }

    clearInterval(printInterval);
    const majorGcTime = printStats(counters);

    server.close();

    const type = 'bunchNested';

    const statsFile = fs.readFileSync('./stats.json', 'utf-8');
    const stats = JSON.parse(statsFile);
    if (!stats[type]) {
        stats[type] = [];
    }
    stats[type].push(majorGcTime);

    fs.writeFileSync('./stats.json', JSON.stringify(stats, null, 2));
}

// get arguments
const args = process.argv.slice(2);
const count = args[0] ? parseInt(args[0]) : 0;

if (!count) {
    console.error('Please specify count of objects to generate');
    process.exit(1);
}

// Генерируем объекты, которые всегда будут в памяти
global.usedMemory = objectGenerator.createBunchOfNestedObjects(count / 10000, 10000);

run();
