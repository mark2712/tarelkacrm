import { action, makeObservable, observable, reaction, toJS } from "mobx";
import { Operation, TOperationSaveData } from "./Operation";
import { ISaveProvider } from "@/common/saveData/ISaveProvider";


export class OperationsController<TData> {
    @observable sourceTable: TData[] = [];
    @observable resultTable: TData[] = [];
    @observable.shallow operations: Operation<TData, any>[] = [];
    private saveProvider: ISaveProvider;

    constructor(saveProvider: ISaveProvider, operations: Operation<TData, any>[] = []) {
        this.saveProvider = saveProvider;
        makeObservable(this);
        this.addOperations(operations);

        // реагируем на любые изменения enabled/options внутри операций
        reaction(
            () => this.operations.map(op => ({
                enabled: op.enabled,
                // options: op.options,
                optionsJSON: JSON.stringify(op.options) // безопасный трекер вложенных опций
            })),
            () => this.recalculate()
        );

        // реагируем на изменения исходной таблицы (slice -> отслеживание элементов)
        reaction(
            () => this.sourceTable.slice(),
            (value, previousValue, reaction) => {
                this.recalculate();
            }
        );
    }

    @action
    addOperations(operations: Operation<TData, any>[]) {
        this.operations.push(...operations);
        this.load();
        this.recalculate();
    }

    @action
    recalculate() {
        // console.log("OperationsController recalculate");
        let data = this.sourceTable;

        for (const op of this.operations) {
            op.data = data;
            if (op.enabled) data = op.apply();
        }

        this.save();
        this.resultTable = data;
    }

    save() {
        const allOperations: any = {};

        for (const operation of this.operations) {
            allOperations[operation.id] = operation.save();
        }

        this.saveProvider.save(JSON.stringify(allOperations));
    }

    load() {
        try {
            const raw = this.saveProvider.load();
            if (!raw) return;

            const parsed = JSON.parse(raw);

            for (const operation of this.operations) {
                const saved = parsed[operation.id];
                if (saved) operation.load(saved);
            }
        } catch (err) {
            console.warn("Failed to load operations:", err);
        }
    }
}