export interface ISaveProvider {
    load(): string | null;
    save(data: string): void;
}