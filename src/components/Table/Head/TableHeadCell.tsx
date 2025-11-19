import { observer } from "mobx-react";
import css from "./css.module.css";
import { BaseColumn } from "@/components/Table/Columns";
import { TableData } from "@/components/Table/TableData";

interface TableHeadCellProps<Row> {
    col: BaseColumn<Row, any, any>;
    table: TableData<Row>;
}

const TableHeadCell = observer(<Row,>({ col, table }: TableHeadCellProps<Row>) => {
    return (
        <th>
            <div className={css.TableHeadCell}><div title="автоширина" className={css.AutoWidth}>-</div>{col.title}<div title="переместить столбец" className={css.Move}>+</div></div>
            {/* <input
                type="checkbox"
                checked={col.visible}
                onChange={e => table.setColumnVisible(col.id, e.target.checked)}
            /> */}
        </th>
    );
});

export default TableHeadCell;