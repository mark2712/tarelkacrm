"use client";

import { BaseColumn } from "@/components/Table/Columns";
import { observer } from "mobx-react-lite";


interface TableCellProps<Value> {
    col: BaseColumn<any, any>;
    value: Value;
}

const TableCell = observer(<Value,>({ col, value }: TableCellProps<Value>) => {
    const Cell = col.cellComponent;
    return <td><Cell value={value} /></td>;
});

export default TableCell;