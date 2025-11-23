"use client";
import { makeObservable, observable, action } from "mobx";


export type TOperationSaveData = {
    enabled: boolean;
    options: any;
}

export class Operation<TData, TOptions = void> {
    id: string;
    label: string;
    @observable enabled = true;

    @observable options!: TOptions;
    OptionsComponent?: React.FC<{ option: TOptions }>;

    @observable.shallow data: TData[] = [];

    constructor(id: string, label?: string, OptionsComponent?: any) {
        this.id = id;
        this.label = label ?? id;
        this.OptionsComponent = OptionsComponent;

        makeObservable(this);
    }

    @action
    setEnabled(v: boolean) {
        this.enabled = v;
    }

    @action
    setOptions(o: TOptions) {
        this.options = o;
    }

    save(): TOperationSaveData {
        return {
            enabled: this.enabled,
            options: this.options,
        };
    }

    load(data: TOperationSaveData) {
        if (!data) return;
        this.enabled = data.enabled ?? this.enabled;
        this.options = data.options ?? this.options;
    }

    @action
    apply(): TData[] {
        return this.data;
    }
}

