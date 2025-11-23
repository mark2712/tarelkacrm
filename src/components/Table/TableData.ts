import { makeAutoObservable, action, observable, computed } from "mobx";
import { BaseColumn } from "@/components/Table/ColumnsStore";
import { ISaveProvider } from "@/common/saveData/ISaveProvider";


export class TableData<Row> {
    public columns: BaseColumn<Row, any>[];
    private getRows: () => Row[];
    private saveProvider: ISaveProvider;

    @computed
    get rows() {
        return this.getRows();
    }

    constructor(columns: BaseColumn<Row, any>[], getRows: () => Row[], saveProvider: ISaveProvider) {
        this.columns = columns;
        this.getRows = getRows;
        this.saveProvider = saveProvider;

        makeAutoObservable(this);

        this.load();
    }

    @action
    save() {
        const payload = this.columns.map(c => ({
            id: String(c.id),
            width: c.width,
            autoWidth: c.autoWidth,
            visible: c.visible,
        }));
        this.saveProvider.save(JSON.stringify(payload));
    }

    @action
    load() {
        const json = this.saveProvider.load();
        if (!json) return;
        const saved = JSON.parse(json);
        saved.forEach((s: any) => {
            const col = this.columns.find(c => String(c.id) === s.id);
            if (col) {
                col.width = s.width;
                col.autoWidth = s.autoWidth;
                col.visible = s.visible;
            }
        });
    }


    @action
    setColumnVisible(columnId: string, visible: boolean) {
        const col = this.columns.find(c => c.id === columnId);
        if (col) {
            col.visible = visible;
            this.save(); // сохраняем сразу
        }
    }

    @action
    toggleAllColumns(visible: boolean) {
        this.columns.forEach(col => col.visible = visible);
        this.save();
    }
}