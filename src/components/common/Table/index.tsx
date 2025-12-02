"use client";

import { observer } from "mobx-react-lite";
import css from "./css.module.css";
import { TableData } from "@/components/common/Table/TableData";
import TableHeader from "@/components/common/Table/TableHeader";
import TableHead from "./Head/TableHead";
import TableBody from "./Body/TableBody";


export const Table = observer(<Row,>({ table }: { table: TableData<Row> }) => {
    return (
        <>
            <TableHeader table={table} />
            <table className={css.Table}>
                <TableHead table={table} />
                <TableBody table={table} />
            </table>
        </>
    );
});

export default Table;
