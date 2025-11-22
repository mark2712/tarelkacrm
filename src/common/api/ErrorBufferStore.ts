"use client";

import { action, makeObservable, observable, toJS } from "mobx";

export interface ErrorData {
    message: string;
    status: number;
    rawHtml: string;
    timestamp: number;
    id?: string; // для ключей в React для вывода ошибок в компонент
}

class ErrorBufferStore {
    @observable errors: ErrorData[] = [];
    limit = 10;

    constructor() {
        makeObservable(this);
    }

    @action
    push(error: ErrorData) {
        const errorWithId = {
            ...error,
            id: Math.random().toString(36).substr(2, 9) // уникальный ID
        };

        this.errors.unshift(errorWithId);

        if (this.errors.length > this.limit) {
            this.errors.pop();
        }
        console.log(toJS(this.errors));
    }

    @action
    remove(id: string) {
        this.errors = this.errors.filter(error => error.id !== id);
    }

    @action
    clear() {
        this.errors = [];
    }
}

export const errorBuffer = new ErrorBufferStore();