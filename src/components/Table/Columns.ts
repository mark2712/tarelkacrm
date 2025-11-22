"use client";

import { makeObservable, observable } from "mobx";

export interface TColumn<Row, K extends keyof Row> {
    field: K; // ключ для данных, по нему солонки соотностся с данными
    id: string; // уникальный id колонки чтобы можно было сделать дубли колонок в одной таблице
    title: string; // отображаемое имя колонки
    width: number;
    autoWidth: boolean;
    visible: boolean;
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


// import { makeObservable, observable } from "mobx";

// export interface TColumn<Row, K extends keyof Row> {
//     id: K;
//     title: string;
//     width: number;
//     autoWidth: boolean;
//     visible: boolean;
// }

// export interface TColumnComponent<Value> {
//     cellComponent: React.FC<{ value: Value }>;
// }

// export class BaseColumn<Row, K extends keyof Row, Value> implements TColumn<Row, K>, TColumnComponent<Value> {
//     id: K;
//     title: string;
//     width = 120;
//     autoWidth = true;
//     visible = true;
//     cellComponent: React.FC<{ value: Value }>;

//     constructor(id: K, title: string, cellComponent: React.FC<{ value: Value }>) {
//         this.id = id;
//         this.title = title;
//         this.cellComponent = cellComponent;

//         makeObservable(this, {
//             width: observable,
//             autoWidth: observable,
//             visible: observable
//         });
//     }
// }