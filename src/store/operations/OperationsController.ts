import { action, makeObservable, observable, reaction, toJS } from "mobx";
import { Operation } from "./Operation";


export class OperationsController<TData> {
    sourceTable: TData[] = [];
    resultTable: TData[] = [];
    operations: Operation<TData, any>[] = [];

    constructor(sourceTable: TData[], operations: Operation<TData, any>[] = []) {
        this.sourceTable = sourceTable;

        makeObservable(this, {
            sourceTable: observable,
            resultTable: observable,
            operations: observable.shallow,
            addOperations: action,
            recalculate: action,
        });

        this.addOperations(operations);

        // реагируем на любые изменения enabled/options внутри операций
        reaction(
            () => this.operations.map(op => ({
                enabled: op.enabled,
                options: op.options,
                // optionsJSON: JSON.stringify(op.options) // безопасный трекер вложенных опций
            })),
            () => this.recalculate()
        );

        // реагируем на изменения исходной таблицы (slice -> отслеживание элементов)
        reaction(
            () => this.sourceTable.slice(),
            () => this.recalculate()
        );
    }

    addOperations(operations: Operation<TData, any>[]) {
        this.operations.push(...operations);
        this.recalculate();
    }

    recalculate() {
        let data = this.sourceTable;

        for (const op of this.operations) {
            op.data = data;
            if (op.enabled) data = op.apply();
        }

        this.resultTable = data;
    }
}