export interface ISaveProvider {
    key: string;
    load(): string | null;
    save(data: string): void;
}