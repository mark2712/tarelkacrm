"use client";

import { TableData } from "@/components/common/Table/TableData";
import { observer } from "mobx-react-lite";
import TableCell from "./TableCell";


interface TableRowProps<Row> {
    row: Row | any;
    table: TableData<Row>;
}

const TableRow = observer(<Row,>({ row, table }: TableRowProps<Row>) => {
    return (
        <tr>
            {table.columns.map(col => (
                col.visible && <TableCell key={String(col.id)} col={col} value={row[col.id]} />
            ))}
        </tr>
    );
});

export default TableRow;