"use client";

import { TableData } from "@/components/common/Table/TableData";
import css from "./css.module.css";
import { observer } from "mobx-react-lite";
import { Text, Callout, Flex, Separator, Strong } from "@radix-ui/themes";
import TableHeaderDropdownMenu from "./TableHeaderDropdownMenu";


export interface TableHeaderProps<Row> {
    table: TableData<Row>
}

const TableHeader = observer(<Row,>({ table }: TableHeaderProps<Row>) => {
    const { columns } = table;

    return (
        <Callout.Root color="gray" mt="2" style={{ margin: "10px" }}>
            <Flex align="start" gap="3" style={{ alignItems: "center", flexWrap: "wrap" }}>
                <TableHeaderDropdownMenu table={table} />
                <Separator orientation="vertical" />

                <Text>Строк: <Strong>{table.rows.length}</Strong></Text>
                <Separator orientation="vertical" />

                <Text>Показать колонки: </Text>
                <Flex align="start" gap="1" style={{ flexWrap: "wrap" }}>
                    {/* переключатель ВСЕ */}
                    <label className={css.colsVisibleElem}>
                        <input
                            type="checkbox"
                            checked={columns.every(c => c.visible)}
                            onChange={(e) => table.toggleAllColumns(e.target.checked)}
                        />
                        <div>Все</div>
                    </label>

                    {/* переключатель каждой колонки */}
                    {columns.map(col => (
                        <label className={css.colsVisibleElem} key={String(col.id)}>
                            <input
                                type="checkbox"
                                checked={col.visible}
                                onChange={(e) => table.setColumnVisible(col.id, e.target.checked)}
                            />
                            <div>{col.title}</div>
                        </label>
                    ))}
                </Flex>
            </Flex>
        </Callout.Root>
    );
});

export default TableHeader;

