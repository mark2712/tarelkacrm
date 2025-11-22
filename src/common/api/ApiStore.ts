"use client";

import { makeObservable, observable, action, runInAction, computed, toJS, makeAutoObservable, isObservableProp, autorun } from "mobx";
import { apiClient, ApiResponse } from "./ApiClient";


export class ApiStore<T> {
    @observable _data?: T;
    @observable loading = false;
    @observable firstLoadingEnd = false;
    @observable loadTime?: number;

    endpoint: string;
    defaultBody?: any;

    @computed get data() {
        this.onGetData();
        return this._data;
    }

    onGetData() {
        // console.log('ApiStore get data');
        // console.log(toJS(this._data));
    }

    constructor(endpoint: string, defaultBody?: any) {
        this.endpoint = endpoint;
        this.defaultBody = defaultBody;

        makeObservable(this);
    }

    @action.bound
    async load(body?: any) {
        this.loading = true;
        this.loadTime = undefined;

        const start = performance.now(); // старт таймера

        const merged = {
            ...(this.defaultBody || {}),
            ...(body || {})
        };

        const res = await apiClient.send<T>(this.endpoint, merged);

        const end = performance.now();   // конец таймера
        const elapsed = (end - start) / 1000;

        this.getRes(res, elapsed);
    }

    @action.bound
    private async getRes(res: ApiResponse<T>, elapsed: number) {
        this.loading = false;
        this.firstLoadingEnd = true;

        // только если успешный ответ — записываем данные и время
        if (!res.json || res.json.ok === false) return;

        this._data = res.json.data as T;
        this.loadTime = elapsed;
    }
}

