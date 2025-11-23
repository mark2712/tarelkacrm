import { ISaveProvider } from "../ISaveProvider";


export class MemorySaver implements ISaveProvider {
    private store: Record<string, string> = {};
    constructor(private key: string) { }

    load() {
        return this.store[this.key] ?? null;
    }
    save(data: string) {
        this.store[this.key] = data;
    }
}