import { makeAutoObservable, action, observable, computed } from "mobx";
import { BaseColumn } from "@/components/Table/Columns";
import { ISaveProvider } from "@/store/SaveProvider";


export class TableData<Row> {
    public columns: BaseColumn<Row, any>[];
    private getRows: () => Row[];
    private saveProvider: ISaveProvider;

    get rows() {
        return this.getRows();
    }

    constructor(columns: BaseColumn<Row, any>[], getRows: () => Row[], saveProvider: ISaveProvider) {
        this.columns = columns;
        this.getRows = getRows;
        this.saveProvider = saveProvider;

        makeAutoObservable(this, {
            save: action,
            load: action,
            setColumnVisible: action,
            rows: computed,
        });

        this.load();
    }

    save() {
        const payload = this.columns.map(c => ({
            id: String(c.id),
            width: c.width,
            autoWidth: c.autoWidth,
            visible: c.visible,
        }));
        this.saveProvider.save(JSON.stringify(payload));
    }

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


    setColumnVisible(columnId: string, visible: boolean) {
        const col = this.columns.find(c => c.id === columnId);
        if (col) {
            col.visible = visible;
            this.save(); // сохраняем сразу
        }
    }

    toggleAllColumns(visible: boolean) {
        this.columns.forEach(col => col.visible = visible);
        this.save();
    }
}