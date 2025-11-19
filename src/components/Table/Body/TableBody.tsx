import { TableData } from "@/components/Table/TableData";
import { observer } from "mobx-react";
import TableRow from "./TableRow";

interface TableBodyProps<Row> {
    table: TableData<Row>;
}

const TableBody = observer(<Row,>({ table }: TableBodyProps<Row>) => {
    return (
        <tbody>
            {table.rows.map((row, idx) => (
                <TableRow key={idx} row={row} table={table} />
            ))}
        </tbody>
    );
});

export default TableBody;