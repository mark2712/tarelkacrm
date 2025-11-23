import { ISaveProvider } from "./ISaveProvider";

import { LocalStorageSaver } from "./savers/LocalStorageSaver";
import { MemorySaver } from "./savers/MemorySaver";


export class SaveProvider implements ISaveProvider {
    private saver: ISaveProvider;

    constructor(key: string) {
        this.saver = typeof window !== "undefined"
            ? new LocalStorageSaver(key)
            : new MemorySaver(key);
    }

    load(): string | null {
        return this.saver.load();
    }

    save(data: string): void {
        this.saver.save(data);
    }
}
