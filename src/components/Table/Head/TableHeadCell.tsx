"use client";

import { observer } from "mobx-react-lite";
import css from "./css.module.css";
import { BaseColumn } from "@/components/Table/Columns";
import { TableData } from "@/components/Table/TableData";
import { DragHandleDots1Icon, ChevronLeftIcon, ChevronRightIcon, DropdownMenuIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";


interface TableHeadCellProps<Row> {
    col: BaseColumn<Row, any>;
    table: TableData<Row>;
}

const TableHeadCell = observer(<Row,>({ col, table }: TableHeadCellProps<Row>) => {
    return (
        <th>
            <div className={css.TableHeadCell}>
                <div title="переместить столбец" className={css.Move}><ChevronLeftIcon /></div>
                {/* <div title="автоширина" className={css.AutoWidth}><HamburgerMenuIcon /></div> */}
                {col.title}
                {/* <div title="автоширина" className={css.AutoWidth}><HamburgerMenuIcon /></div> */}
                <div title="переместить столбец" className={css.Move}><ChevronRightIcon /></div>
            </div>
            {/* <input
                type="checkbox"
                checked={col.visible}
                onChange={e => table.setColumnVisible(col.id, e.target.checked)}
            /> */}
        </th>
    );
});

export default TableHeadCell;