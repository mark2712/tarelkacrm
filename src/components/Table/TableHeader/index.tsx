import { TableData } from "@/components/Table/TableData";
import css from "./css.module.css";
import { observer } from "mobx-react";

export interface TableHeaderProps<Row> {
    table: TableData<Row>
}

const TableHeader = observer(<Row,>({ table }: TableHeaderProps<Row>) => {
    const { columns } = table;

    return (
        <div className={css.TableHeader}>
            <div className={css.colsVisible}>
                <div><b>Показать колонки:</b></div>
                <div className={css.colsVisibleElems}>

                    {/* переключатель ВСЕ */}
                    <label className={css.colsVisibleElem}>
                        <input
                            type="checkbox"
                            checked={columns.every(c => c.visible)}
                            onChange={(e) => table.toggleAllColumns(e.target.checked)}
                        />
                        <div>Все</div>
                    </label>

                    {/* переключатель каждой колонки */}
                    {columns.map(col => (
                        <label className={css.colsVisibleElem} key={String(col.id)}>
                            <input
                                type="checkbox"
                                checked={col.visible}
                                onChange={(e) => table.setColumnVisible(col.id, e.target.checked)}
                            />
                            <div>{col.title}</div>
                        </label>
                    ))}
                </div>
            </div>

            {/* <div className={css.colsFilters}>
                тут в будущем будут фильтры
            </div> */}
        </div>
    );
});

export default TableHeader;