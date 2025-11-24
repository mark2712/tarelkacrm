import { observer } from "mobx-react-lite";
import { CopyIcon, DropdownMenuIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { TableHeaderProps } from ".";


const TableHeaderDropdownMenu = observer(<Row,>({ table }: TableHeaderProps<Row>) => {
    // --- Копировать таблицу полностью с заголовком ---
    const handleCopyTableWithHeader = async () => {
        copyTable(true);
    };

    // --- Копировать только данные ---
    const handleCopyTableDataOnly = async () => {
        copyTable(false);
    };

    const copyTable = async (includeHeader: boolean) => {
        let tableText = '';
        try {
            const visibleCols = table.visibleColumns;
            const headers = visibleCols.map(col => col.title).join('\t');
            const rows = table.rows.map(row =>
                visibleCols.map(col => String(row[col.id as keyof Row] || '')).join('\t')
            ).join('\n');

            tableText = includeHeader ? [headers, rows].join('\n') : rows;

            await navigator.clipboard.writeText(tableText);
            console.log('Таблица скопирована в буфер обмена');
        } catch (err) {
            console.error('Ошибка при копировании:', err);
            const textArea = document.createElement('textarea');
            textArea.value = tableText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger style={{ cursor: "pointer" }}>
                <Button variant="soft"><DropdownMenuIcon /> Опции</Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                sideOffset={5}
                align="start"
            >
                <DropdownMenu.Item
                    onSelect={() => table.resetSort()}
                >
                    <ReloadIcon />
                    Сбросить сортировку
                </DropdownMenu.Item>

                <DropdownMenu.Item
                    onSelect={() => table.resetColumns()}
                >
                    <ReloadIcon />
                    Сбросить порядок столбцов
                </DropdownMenu.Item>
                <DropdownMenu.Separator />

                <DropdownMenu.Item
                    onSelect={handleCopyTableWithHeader}
                >
                    <CopyIcon />
                    Копировать таблицу (с заголовком)
                </DropdownMenu.Item>

                <DropdownMenu.Item
                    onSelect={handleCopyTableDataOnly}
                >
                    <CopyIcon />
                    Копировать только данные
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
});

export default TableHeaderDropdownMenu;
