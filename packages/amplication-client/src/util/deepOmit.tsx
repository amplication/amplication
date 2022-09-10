import unset from 'unset-value';
import isObject from 'is-plain-object';

export function omitDeep(value: any, keys: string[]) {
    if (typeof value === 'undefined') {
        return {};
    }

    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            value[i] = omitDeep(value[i], keys);
        }
        return value;
    }

    // @ts-ignore
    if (!isObject(value)) {
        return value;
    }

    if (typeof keys === 'string') {
        keys = [keys];
    }

    if (!Array.isArray(keys)) {
        return value;
    }

    for (let j = 0; j < keys.length; j++) {
        unset(value, keys[j]);
    }

    for (const key in value) {
        if (value.hasOwnProperty(key)) {
            value[key] = omitDeep(value[key], keys);
        }
    }

    return value;
}
