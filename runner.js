const { spawn } = require('child_process');
const scriptToRun = 'node index.mjs';


async function spawnChildProcess(args) {
    return new Promise((resolve, reject) => {
        const child = spawn(scriptToRun, args, {
            stdio: 'inherit',
            shell: true,
        });

        child.on('exit', (code) => {
            resolve();
        });
    });
}

async function testSingleType(type) {
    for (let count = 50_000; count <= 1_000_000; count += 50_000) {
        await spawnChildProcess([count, type]);
    }

    console.log('Done');
}

(async () => {
    await testSingleType('plain');
    await testSingleType('array');
    await testSingleType('nested');
    await testSingleType('bunch');
    await testSingleType('bunch10');
})();
