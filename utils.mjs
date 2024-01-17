export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatBytes(bytes, decimals = 2) {
    const mb = bytes / 1024 / 1024;

    return `${mb.toFixed(decimals)}MB`;
}

export function randomString() {
    return Math.random().toString(36).substring(2, 15);
}