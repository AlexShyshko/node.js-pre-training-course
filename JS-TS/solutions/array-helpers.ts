/* eslint-disable @typescript-eslint/no-unused-vars */
// Task 02: Mini functional–utility library
// All helpers are declared but not implemented.

export function mapArray<T, R>(source: readonly T[], mapper: (item: T, index: number) => R): R[] {
    nullCheck(source);

    const result: R[] = [];

    source.forEach((element, index) => {
        const elementResult = mapper(element, index);
        result.push(elementResult);
    });

    return result;
}

export function filterArray<T>(source: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
    nullCheck(source);

    const result: T[] = [];

    source.forEach((element, index) => {
        const elementResult = predicate(element, index);
        elementResult && result.push(element);
    });

    return result;
}

export function reduceArray<T, R>(source: readonly T[], reducer: (acc: R, item: T, index: number) => R, initial: R): R {
    nullCheck(source);

    let result: R = initial;

    source.forEach((element, index) => {
        const elementResult = reducer(result, element, index);
        result = elementResult;
    });

    return result;
}

export function partition<T>(source: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
    nullCheck(source);

    const result: [T[], T[]] = [[], []];
    const indexPass = 0;
    const indexFail = 1;

    source.forEach((element) => {
        const elementResult = predicate(element);
        elementResult ? result[indexPass].push(element) : result[indexFail].push(element);
    });

    return result;
}

export function groupBy<T, K extends PropertyKey>(source: readonly T[], keySelector: (item: T) => K): Record<K, T[]> {
    nullCheck(source);

    const result = {} as Record<K, T[]>;

    source.forEach((element) => {
        const elementResult = keySelector(element);
        result.hasOwnProperty(elementResult) ? result[elementResult].push(element) : result[elementResult] = [element];
    });

    return result;
}

function nullCheck<T>(sourceToCheck: readonly T[]) {
    sourceToCheck ?? (()=>{throw new TypeError('Array not defined')})();
}

// run single file test
// npx jest tests/js-ts-task-02.test.ts