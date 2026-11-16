export class InMemoryRepository<T extends { id: number }> {
    // private storage
    private items: T[] = [];

    add(entity: T): T {
        this.items = [...this.items, entity];
        return entity;
    }

    update(id: number, patch: Partial<T>): T {
        const targetEntity = this.findById(id);
        this.nullCheck(targetEntity, id);
        const result = {
            ...targetEntity,
            ...patch
        } as T;
        const targetEntityIndex = this.items.indexOf(targetEntity!);
        this.items = this.items.slice(0, targetEntityIndex).concat(result, this.items.slice(targetEntityIndex + 1));
        return result;
    }

    remove(id: number): void {
        const targetEntity = this.findById(id);
        this.nullCheck(targetEntity, id);
        const targetEntityIndex = this.items.indexOf(targetEntity!);
        this.items = this.items.slice(0, targetEntityIndex).concat(this.items.slice(targetEntityIndex + 1));
    }

    findById(id: number): T | undefined {
        const result = this.items.find((element) => element.id === id);
        return result;
    }

    findAll(): T[] {
        const result = this.items;
        return result;
    }

    private nullCheck(entityToCheck: T | undefined, id: number) {
        entityToCheck ?? (()=>{throw new Error(`Entity with ID ${id} is not found`)})();
    }
}

// run single file test
// npx jest tests/js-ts-task-07.test.ts