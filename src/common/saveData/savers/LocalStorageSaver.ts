import { ISaveProvider } from "../ISaveProvider";


export class LocalStorageSaver implements ISaveProvider {
    constructor(private key: string) { }

    load() {
        return localStorage.getItem(this.key);
    }

    save(data: string) {
        localStorage.setItem(this.key, data);
    }
}

