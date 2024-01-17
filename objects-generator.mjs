import { randomString } from './utils.mjs';

export function createPlainObject(count) {
    const obj = {};

    for (let i = 0; i < count; i++) {
        obj[i] = {
            memory: randomString(),
            next: {},
        };
    }

    return obj;
}

export function createArray(count) {
    const arr = [];

    for (let i = 0; i < count; i++) {
        arr.push({
            memory: randomString(),
            next: {},
        });
    }

    return arr;
}

export function createNestedObject(count) {
    const obj = {};
    let current = obj;

    for (let i = 0; i < count; i++) {
        current.memory = randomString();
        current.next = {};
        current = current.next;
    }

    return obj;
}

export function createBunchOfNestedObjects(count, depth = 1000) {
    const objectsCount = Math.floor(count / depth);
    const obj = {};

    for (let i = 0; i < objectsCount; i++) {
        obj[i] = createNestedObject(depth);
    }

    return obj;
}
