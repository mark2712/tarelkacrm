import { TableData } from "@/components/Table/TableData";
import { observer } from "mobx-react";
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