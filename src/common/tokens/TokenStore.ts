"use client";

import { makeAutoObservable, action } from "mobx";
import { apiTokens, ApiTokenInfo } from "@/common/api/ApiUrls";

export interface TokenItem {
    key: string;
    value: string;
    label: string;
    description?: string;
    isPredefined: boolean;
}

export class TokenStore {
    tokens: Record<string, string> = {};
    isLoaded: boolean = false;

    constructor() {
        makeAutoObservable(this);
        if (typeof window !== "undefined") {
            this.loadAll();
            window.addEventListener("storage", action(() => this.loadAll()));
            window.addEventListener("tarelkacrm:tokens_updated", action(() => this.loadAll()));
        }
    }

    loadAll() {
        if (typeof window === "undefined") return;

        const result: Record<string, string> = {};

        // 1. Считываем предопределенные токены из apiTokens (только если они реально есть в localStorage)
        Object.values(apiTokens).forEach((tokenDef) => {
            const val = localStorage.getItem(tokenDef.key);
            if (val !== null) {
                result[tokenDef.key] = val;
            }
        });

        // 2. Считываем любые другие ключи из localStorage, оканчивающиеся на _TOKEN или TOKEN/API_KEY
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.toUpperCase().includes("TOKEN") || key.toUpperCase().includes("API_KEY"))) {
                const val = localStorage.getItem(key);
                if (val !== null) {
                    result[key] = val;
                }
            }
        }

        this.tokens = result;
        this.isLoaded = true;
    }

    getToken(key: string, fallback: string = ""): string {
        if (typeof window === "undefined") return fallback;
        const stored = this.tokens[key] ?? localStorage.getItem(key);
        return stored !== null && stored !== undefined ? stored : fallback;
    }

    hasToken(key: string): boolean {
        if (typeof window === "undefined") return false;
        return key in this.tokens || localStorage.getItem(key) !== null;
    }

    setToken(key: string, value: string) {
        const trimmedKey = key.trim();
        if (!trimmedKey) return;

        if (typeof window !== "undefined") {
            localStorage.setItem(trimmedKey, value);
            this.tokens[trimmedKey] = value;
            this.notify();
        }
    }

    deleteToken(key: string) {
        const trimmedKey = key.trim();
        if (typeof window !== "undefined") {
            localStorage.removeItem(trimmedKey);
            delete this.tokens[trimmedKey];
            this.notify();
        }
    }

    private notify() {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("tarelkacrm:tokens_updated"));
        }
    }

    // Возвращает ТОЛЬКО те ключи, которые РЕАЛЬНО существуют в localStorage (включая пустую строку)
    get savedTokenItems(): TokenItem[] {
        const items: TokenItem[] = [];

        Object.entries(this.tokens).forEach(([key, value]) => {
            const predefined = Object.values(apiTokens).find((t) => t.key === key);

            items.push({
                key,
                value,
                label: predefined?.label || key,
                description: predefined?.description,
                isPredefined: Boolean(predefined),
            });
        });

        return items;
    }

    // Список всех доступных предопределенных ключей системы для выбора
    get predefinedTokens(): (ApiTokenInfo & { isSaved: boolean })[] {
        return Object.values(apiTokens).map((item) => ({
            ...item,
            isSaved: item.key in this.tokens,
        }));
    }

    // Количество реально сохраненных ключей
    get savedCount(): number {
        return Object.keys(this.tokens).length;
    }
}

export const tokenStore = new TokenStore();
export default tokenStore;
