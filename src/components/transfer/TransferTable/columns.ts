import { TableData } from "@/components/Table/TableData";
import { BaseColumn } from "@/components/Table/Columns";
import saveProvider from "@/store/SaveProvider";

import CellString from "@/components/TablesCells/CellString";
import { transferTableStore, ProcessedLead } from "../store/TransferTableStore";
import transferOperationStore from "../store/TransferOperationStore";


const tableData = new TableData(
    [
        new BaseColumn<ProcessedLead, "phone">("phone", CellString).Title("Телефон"),
        new BaseColumn<ProcessedLead, "name1">("name1", CellString).Title("Имя"),
        new BaseColumn<ProcessedLead, "section">("section", CellString).Title("Секция"),
        new BaseColumn<ProcessedLead, "form">("form", CellString).Title("Форма"),
        new BaseColumn<ProcessedLead, "geo">("geo", CellString).Title("Регион"),
        new BaseColumn<ProcessedLead, "transport">("transport", CellString).Title("Транспорт"),
        new BaseColumn<ProcessedLead, "url">("url", CellString).Title("url"),
        new BaseColumn<ProcessedLead, "calc_all">("calc_all", CellString).Title("Калькулятор"),
        new BaseColumn<ProcessedLead, "ip">("ip", CellString).Title("ip"),
        new BaseColumn<ProcessedLead, "sourse">("sourse", CellString).Title("Источник"),
        new BaseColumn<ProcessedLead, "all_data">("all_data", CellString).Title("Сырые данные"),
    ],
    // () => transferTableStore.tableLeads,
    () => transferOperationStore.resultTable,
    saveProvider.create("TransferZakazTableSettings"),
);
export default tableData;



// new BaseColumnString<ProcessedLead, "section">("section", "Источник"),
// new BaseColumnString<ProcessedLead, "first_referrer">("first_referrer", "первый реферер"),
// new BaseColumnString<ProcessedLead, "firstPage">("firstPage", "страница входа"),