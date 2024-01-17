import * as http from 'node:http';

export function load(url) {
    return new Promise(resolve => {
        http.get(url, (res) => {
            res.on('data', () => {});
            res.on('end', () => {
                resolve();
            });
        });
    });
}