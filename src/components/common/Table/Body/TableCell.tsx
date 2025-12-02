"use client";

import { BaseColumn } from "@/components/common/Table/ColumnsStore";
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