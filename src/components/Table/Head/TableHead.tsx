"use client";

import { observer } from "mobx-react-lite";
import { TableData } from "@/components/Table/TableData";
import TableHeadCell from "./TableHeadCell";

interface TableHeadProps<Row> {
    table: TableData<Row>;
}

const TableHead = observer(<Row,>({ table }: TableHeadProps<Row>) => {
    return (
        <thead>
            <tr>
                {table.columns.map(col => (
                    col.visible && <TableHeadCell key={String(col.id)} col={col} table={table} />
                ))}
            </tr>
        </thead>
    );
});

export default TableHead;