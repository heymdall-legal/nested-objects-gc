import { constants, PerformanceObserver } from 'node:perf_hooks';
import { stdout } from 'node:process';
import * as v8 from 'node:v8';

import { formatBytes } from './utils.mjs'

export function startObserving() {
    const kinds = [];
    kinds[constants.NODE_PERFORMANCE_GC_MAJOR] = 'major';
    kinds[constants.NODE_PERFORMANCE_GC_MINOR] = 'minor';
    kinds[constants.NODE_PERFORMANCE_GC_INCREMENTAL] = 'incremental';
    kinds[constants.NODE_PERFORMANCE_GC_WEAKCB] = 'weakcb';
    
    const counters = {};
    
    const obs = new PerformanceObserver(list => {
        const entry = list.getEntries()[0];
        const entryKind = entry.detail.kind;
        const kind = kinds[entryKind];
    
    
        if (!counters[kind]) {
            counters[kind] = [];
        }
        counters[kind].push(entry.duration);
    });
    
    obs.observe({ entryTypes: ['gc'] });

    return counters;
}

export function printStats(counters) {
    stdout.write('\x1Bc'); // clear console
    console.log(`Memory usage: ${formatBytes(process.memoryUsage().heapUsed)}`);
    console.log("Heap statistics:");

    v8.getHeapSpaceStatistics().forEach(space => {
        console.log(`  ${space.space_name}: ${formatBytes(space.space_used_size)} / ${formatBytes(space.space_size)}`);
    });

    console.log("GC statistics:");

    let majorGc = 0;

    Object.keys(counters).forEach(kind => {
        const durations = counters[kind];
        const sum = durations.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / durations.length;
        console.log(`Average duration of ${kind} GCs: ${avg}ms, count: ${durations.length}`);

        if (kind === 'major') {
            majorGc = avg;
        }
    });

    return majorGc;
}
