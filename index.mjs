import { startObserving, printStats } from './collect-gc-stats.mjs';
import * as objectGenerator from './objects-generator.mjs';
import { createServer } from './server.mjs';
import { load } from './generate-load.mjs';

import * as fs from 'node:fs';

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
}

// get arguments
const args = process.argv.slice(2);
const count = args[0] ? parseInt(args[0]) : 0;
const kind = args[1] || 'plain';

if (!count) {
    console.error('Please specify count of objects to generate');
    process.exit(1);
}

const objectKinds = {
    plain: objectGenerator.createPlainObject,
    array: objectGenerator.createArray,
    nested: objectGenerator.createNestedObject,
    bunch: objectGenerator.createBunchOfNestedObjects,
    bunch10: (count) => objectGenerator.createBunchOfNestedObjects(count, 10_000),
};

// Генерируем объекты, которые всегда будут в памяти
global.usedMemory = objectKinds[kind](count);

(async () => {
    await run();

    clearInterval(printInterval);

    const gcStats = printStats(counters);

    server.close();

    const statsFile = fs.readFileSync('./out.json', 'utf-8');
    const stats = JSON.parse(statsFile);
    Object.keys(gcStats).forEach(gcType => {
        const statName = `${kind}.${gcType}`;
        if (!stats[statName]) {
            stats[statName] = [];
        }
        stats[statName].push(gcStats[gcType]);
    });

    await fs.promises.writeFile('./out.json', JSON.stringify(stats, null, 2));
})();
