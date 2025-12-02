"use client";

import { observer } from "mobx-react-lite";
import css from "./css.module.css";
import { BaseColumn } from "@/components/common/Table/ColumnsStore";
import { TableData } from "@/components/common/Table/TableData";
import { ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";


interface TableHeadCellProps<Row> {
    col: BaseColumn<Row, any>;
    table: TableData<Row>;
}

const TableHeadCell = observer(<Row,>({ col, table }: TableHeadCellProps<Row>) => {
    const [ctrl, setCtrl] = useState(false);

    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            if (e.key === "Control") setCtrl(true);
        };
        const handleUp = (e: KeyboardEvent) => {
            if (e.key === "Control") setCtrl(false);
        };
        window.addEventListener("keydown", handleDown);
        window.addEventListener("keyup", handleUp);
        return () => {
            window.removeEventListener("keydown", handleDown);
            window.removeEventListener("keyup", handleUp);
        };
    }, []);

    const handleSort = (e: React.MouseEvent) => {
        if (!e.ctrlKey) return;
        table.toggleSort(col.id);
    };

    return (
        <th onClick={handleSort}>
            <div className={`${css.TableHeadCell} ${ctrl ? css.CtrlActive : ''}`}>
                <div className={css.thSub}>
                    <div
                        title="переместить столбец влево"
                        className={css.Move}
                        onClick={() => table.move(col.id, "left")}
                    >
                        <ChevronLeftIcon />
                    </div>
                    <div className={css.SortIcon}>
                        {col.sort === 'asc' && (
                            <ArrowUpIcon className={css.Active} />
                        )}

                        {col.sort === 'desc' && (
                            <ArrowDownIcon className={css.Active} />
                        )}

                        {col.sort === 'none' && (
                            <ArrowDownIcon
                                className={ctrl ? css.Inactive : css.Hidden}
                            />
                        )}
                    </div>
                </div>

                <div className={css.thTitle}>{col.title}</div>

                <div className={css.thSub}>
                    <div
                        className={
                            col.sort === 'none'
                                ? css.Hidden // скрываем, но оставляем место
                                : css.sortNum
                        }
                    >
                        {col.sortOrder}
                    </div>
                    <div
                        title="переместить столбец вправо"
                        className={css.Move}
                        onClick={() => table.move(col.id, "right")}
                    >
                        <ChevronRightIcon />
                    </div>
                </div>
            </div>
        </th>
    );
});

export default TableHeadCell;
