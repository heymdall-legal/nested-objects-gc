const scriptToRun = 'node index.mjs';

const { spawn } = require('child_process');

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

async function main() {
    for (let count = 50_000; count <= 1_000_000; count += 50_000) {
        await spawnChildProcess([count]);
    }

    console.log('Done');
}

main();
