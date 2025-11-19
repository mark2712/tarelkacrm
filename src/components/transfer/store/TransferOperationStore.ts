import { makeAutoObservable, reaction } from "mobx";
import { ProcessedLead, TransferTableStore, transferTableStore } from "./TransferTableStore";
import { OperationsController } from "@/store/operations/OperationsController";
import { Operation } from "@/store/operations/Operation";
import { DeleteTestNames } from "../operations/deleteTestNames";
import { PeopleFilter } from "../operations/peopleFilter";


class TransferOperationStore extends OperationsController<ProcessedLead> {
    constructor(sourceTable: ProcessedLead[], operations: Operation<ProcessedLead, any>[] = []) {
        super(sourceTable, operations);

        reaction(
            () => this.sourceTable.slice(),
            () => this.recalculate()
        );
    }
}

export const transferOperationStore = new TransferOperationStore(transferTableStore.tableLeads, [
    new DeleteTestNames(),
    new PeopleFilter(),
]);
export default transferOperationStore;




// const operationDeleteTestNames = new DeleteTestNames();



// class OperationsController<T> {
//     table: T;
//     operations: Operation[] = [];

//     constructor(table: T) {
//         this.table = table;
//         makeAutoObservable(this);
//     }

//     addOperations(operation: Operation) {
//         this.operations.push(operation);
//     }
// }



// class TransferOperationStore extends OperationsController<ProcessedLead[]> {
//     constructor(table: ProcessedLead[]) {
//         super(table);
//     }
// }

// export const transferOperationStore = new TransferOperationStore(transferTableStore.tableLeads);

// const deleteTestNames = new DeleteTestNames("DeleteTestNames", "Убрать тестовые лиды", OperationOptionsComponenet);

// transferOperationStore.addOperations([deleteTestNames, operation2, operation3, operation4]);

// export default transferOperationStore;



// class Operation<T> {
//     data: T[] = [];
//     id: string;
//     label: string;
//     enabled: boolean = true;

//     constructor(id: string, label: string = id) {
//         this.id = id;
//         this.label = label;
//     }

//     apply(): T[] {
//         return this.data;
//     }
// }



// class DeleteTestNames extends Operation<ProcessedLead, TOperationOptions> {
//     constructor(id: string, label: string = id, optionsComponenet = OperationOptionsComponenet, mainComponent = OperationComponent) {
//         super(id, label);
//     }

//     apply(): ProcessedLead[] {
//         return this.data?.filter(x => !x.name?.toLowerCase().includes("тест"));
//     }
// }