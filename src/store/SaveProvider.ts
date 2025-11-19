"use client";

export interface ISaveProvider {
    load(): string | null;
    save(data: string): void;
}



export class LocalStorageSaver implements ISaveProvider {
    constructor(private key: string) { }

    load() {
        return localStorage.getItem(this.key);
    }

    save(data: string) {
        localStorage.setItem(this.key, data);
    }
}

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



export class SaveProvider {
    private ProviderClass: { new(key: string): ISaveProvider } = LocalStorageSaver;

    create(key: string) {
        return new this.ProviderClass(key);
    }
}

const saveProvider = new SaveProvider();
export default saveProvider;





// export class SaveProvider {
//     private static ProviderClass: { new (key: string): ISaveProvider } = LocalStorageSaver;

//     static use(Provider: { new (key: string): ISaveProvider }) {
//         SaveProvider.ProviderClass = Provider;
//     }

//     static create(key: string): ISaveProvider {
//         return new SaveProvider.ProviderClass(key);
//     }
// }



// export class StateSaver implements ISaveProvider {
//     state: any = {};
//     key: string;

//     constructor(key: string) {
//         this.key = key;
//     }

//     load() {
//         // console.log(this.state[this.key]);
//         return this.state[this.key];
//     }
//     save(data: string) {
//         // console.log(data);
//         this.state[this.key] = data;
//     }
// };


// export function localStorageSaver(key: string): SaveProvider {
//     return {
//         load: () => localStorage.getItem(key),
//         save: (data) => localStorage.setItem(key, data)
//     };
// }



// export interface SaveProvider {
//     load(): string | null;
//     save(data: string): void;
// }

// export function localStorageSaver(key: string): SaveProvider {
//     const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

//     return {
//         load: () => {
//             if (!isBrowser) return null;
//             try { return localStorage.getItem(key); }
//             catch { return null; }
//         },
//         save: (data: string) => {
//             if (!isBrowser) return;
//             try { localStorage.setItem(key, data); }
//             catch { /* ignore */ }
//         }
//     };
// }