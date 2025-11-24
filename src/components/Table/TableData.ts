import { makeAutoObservable, action, observable, computed, toJS } from "mobx";
import { BaseColumn } from "@/components/Table/ColumnsStore";
import { ISaveProvider } from "@/common/saveData/ISaveProvider";


export class TableData<Row> {
    public columns: BaseColumn<Row, any>[];
    private getRows: () => Row[];
    private saveProvider: ISaveProvider;
    private initialColumns: BaseColumn<Row, any>[];

    @computed
    get rows1() {
        return this.getRows();
    }

    @computed
    get rows() {
        const rows = this.getRows();

        // 1. Собираем только активные колонки для сортировки
        const activeSortCols = this.columns
            .filter(c => c.sort && c.sort !== 'none') // берем только asc/desc
            .sort((a, b) => b.sortOrder - a.sortOrder)
        // .sort((a, b) => a.sortOrder - b.sortOrder); // выстраиваем их по порядку 1, 2, 3

        if (activeSortCols.length === 0) {
            return rows;
        }

        // 2. Сортируем
        return [...rows].sort((a: any, b: any) => {
            for (const col of activeSortCols) {
                const field = col.field;
                const valA = a[field];
                const valB = b[field];

                if (valA === valB) continue;

                let comparison = 0;
                if (valA > valB) comparison = 1;
                if (valA < valB) comparison = -1;

                return col.sort === 'asc' ? comparison : -comparison;
            }
            return 0;
        });
    }

    constructor(columns: BaseColumn<Row, any>[], getRows: () => Row[], saveProvider: ISaveProvider) {
        this.columns = columns;
        this.getRows = getRows;
        this.saveProvider = saveProvider;
        this.initialColumns = [...columns];

        makeAutoObservable(this);

        this.load();
    }

    @action
    save() {
        const payload = this.columns.map(c => ({
            id: c.id,
            width: c.width,
            autoWidth: c.autoWidth,
            visible: c.visible,
            sort: c.sort,
            sortOrder: c.sortOrder,
        }));
        this.saveProvider.save(JSON.stringify(payload));
    }

    @action
    load() {
        const json = this.saveProvider.load();
        if (!json) return;

        try {
            const saved = JSON.parse(json);

            // Восстанавливаем порядок колонок из сохраненных данных
            const savedColumns = new Map(saved.map((s: any) => [s.id, s]));

            // Создаем новый массив колонок в правильном порядке
            const newColumns: BaseColumn<Row, any>[] = [];

            // Сначала добавляем колонки в порядке из saved данных
            saved.forEach((s: any) => {
                const existingCol = this.columns.find(c => c.id === s.id);
                if (existingCol) {
                    existingCol.width = s.width;
                    existingCol.autoWidth = s.autoWidth;
                    existingCol.visible = s.visible;
                    existingCol.sort = s.sort || 'none';
                    existingCol.sortOrder = s.sortOrder || 0;
                    newColumns.push(existingCol);
                }
            });

            // Добавляем колонки, которых не было в saved данных (новые колонки)
            this.columns.forEach(col => {
                if (!savedColumns.has(col.id)) {
                    newColumns.push(col);
                }
            });

            // Заменяем массив колонок
            this.columns = newColumns;

        } catch (e) {
            console.warn('Failed to load table columns settings, ignoring saved data.', e);
            return;
        }
    }


    // двигать колонки учитывая даже скрытые колонки
    @action
    moveAll(colId: string, direction: "left" | "right") {
        const currentIndex = this.columns.findIndex(c => c.id === colId);
        if (currentIndex === -1) return;

        let targetIndex: number;

        if (direction === "left") {
            targetIndex = currentIndex - 1;
        } else {
            targetIndex = currentIndex + 1;
        }

        // Проверяем границы массива
        if (targetIndex < 0 || targetIndex >= this.columns.length) return;

        // Меняем колонки местами
        [this.columns[currentIndex], this.columns[targetIndex]] =
            [this.columns[targetIndex], this.columns[currentIndex]];

        this.save();
    }

    @computed
    get visibleColumns() {
        return this.columns.filter(c => c.visible);
    }

    // двигать колонки не учитывая скрытые колонки
    @action
    move(colId: string, direction: "left" | "right") {
        const visibleColumns = this.visibleColumns;
        const currentIndex = visibleColumns.findIndex(c => c.id === colId);
        if (currentIndex === -1) return;

        let targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= visibleColumns.length) return;

        // Находим индексы в основном массиве
        const currentMainIndex = this.columns.indexOf(visibleColumns[currentIndex]);
        const targetMainIndex = this.columns.indexOf(visibleColumns[targetIndex]);

        // Меняем местами в основном массиве
        [this.columns[currentMainIndex], this.columns[targetMainIndex]] =
            [this.columns[targetMainIndex], this.columns[currentMainIndex]];

        this.save();
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

    // Сбрасываем порядок к первоначальному состоянию
    @action
    resetColumns() {
        if (!this.initialColumns || !this.initialColumns.length) return;

        // переставляем columns в порядок initialColumns по id
        const newOrder = this.initialColumns
            .map(ic => this.columns.find(c => c.id === ic.id))
            .filter(Boolean) as BaseColumn<Row, any>[];

        this.columns.splice(0, this.columns.length, ...newOrder);
        this.save();
    }

    @action
    toggleSort(columnId: string) {
        console.log("sort");

        const col = this.columns.find(c => c.id === columnId);
        if (!col) return;

        // Логика переключения: None -> Asc -> Desc -> None
        if (col.sort === 'none' || !col.sort) {
            // ВКЛЮЧАЕМ СОРТИРОВКУ (ASC)
            col.sort = 'asc';
            // Вычисляем следующий порядковый номер
            // Ищем максимальный sortOrder среди всех колонок
            const maxOrder = this.columns.reduce((max, c) =>
                (c.sort !== 'none' ? Math.max(max, c.sortOrder || 0) : max), 0);

            col.sortOrder = maxOrder + 1;

        } else if (col.sort === 'asc') {
            // ПЕРЕКЛЮЧАЕМ НА DESC
            col.sort = 'desc';
            // sortOrder не меняется, место в очереди то же

        } else {
            // ВЫКЛЮЧАЕМ СОРТИРОВКУ (None)
            const removedOrder = col.sortOrder;
            col.sort = 'none';
            col.sortOrder = 0;

            // Нормализация: сдвигаем очередь. 
            // Если убрали №1, то №2 должен стать №1, а №3 стать №2.
            this.columns.forEach(c => {
                if (c.sort !== 'none' && c.sortOrder > removedOrder) {
                    c.sortOrder = c.sortOrder - 1;
                }
            });
        }

        this.save();
    }

    @action
    resetSort() {
        // Сбрасываем сортировку у всех колонок
        this.columns.forEach(c => {
            c.sort = 'none';
            c.sortOrder = 0;
        });

        this.save();
    }
}
