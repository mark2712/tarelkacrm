"use client";
import { makeObservable, observable } from "mobx";


export type SortType = 'asc' | 'desc' | 'none';

export interface TColumn<Row, K extends keyof Row> {
    field: K; // ключ для данных, по нему колонки соотностся с данными
    id: string; // уникальный id колонки чтобы можно было сделать дубли колонок в одной таблице
    title: string; // отображаемое имя колонки
    width: number;
    autoWidth: boolean;
    visible: boolean;
    sort: SortType;    // 'asc', 'desc' или 'none'
    sortOrder: number; // 1, 2, 3... (0 если не отсортировано)
}

export interface TColumnComponent<Value> {
    cellComponent: React.FC<{ value: Value }>;
}

export class BaseColumn<Row, K extends keyof Row> implements TColumn<Row, K>, TColumnComponent<Row[K]> {
    id: string;
    field: K;
    title: string;
    @observable width = 120;
    @observable autoWidth = true;
    @observable visible = true;
    @observable sort: SortType = 'none';
    @observable sortOrder: number = 0;

    cellComponent: React.FC<{ value: Row[K] }>;

    constructor(field: K, component: React.FC<{ value: Row[K] }>, id: string = field.toString()) {
        this.field = field;
        this.cellComponent = component;
        this.id = id;
        this.title = id;

        makeObservable(this);
    }


    Component(component: React.FC<{ value: Row[K] }>) {
        this.cellComponent = component;
        return this;
    }

    Title(title: string) {
        this.title = title;
        return this;
    }

    Width(width: number) {
        this.width = width;
        this.autoWidth = false;
        return this;
    }

    AutoWidth(flag: boolean) {
        this.autoWidth = flag;
        return this;
    }

    Visible(flag: boolean) {
        this.visible = flag;
        return this;
    }
}
