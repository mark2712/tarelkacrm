import { TableData } from "@/components/Table/TableData";
import { BaseColumn } from "@/components/Table/Columns";
import saveProvider from "@/common/SaveProvider";

import CellString from "@/components/TablesCells/CellString";
import transferOperationStore, { TLead } from "../store/TransferTableStore";


const tableData = new TableData(
    [
        new BaseColumn<TLead, "date">("date", CellString).Title("Дата"),
        new BaseColumn<TLead, "phone">("phone", CellString).Title("Телефон"),
        new BaseColumn<TLead, "name1">("name1", CellString).Title("Имя"),
        new BaseColumn<TLead, "section">("section", CellString).Title("Секция"),
        new BaseColumn<TLead, "form">("form", CellString).Title("Форма"),
        new BaseColumn<TLead, "geo">("geo", CellString).Title("Регион"),
        new BaseColumn<TLead, "transport">("transport", CellString).Title("Транспорт"),
        new BaseColumn<TLead, "url">("url", CellString).Title("url"),
        new BaseColumn<TLead, "calc_all">("calc_all", CellString).Title("Калькулятор"),
        new BaseColumn<TLead, "ip">("ip", CellString).Title("ip"),
        new BaseColumn<TLead, "sourse">("sourse", CellString).Title("Источник"),
        new BaseColumn<TLead, "all_data">("all_data", CellString).Title("Сырые данные"),
    ],
    () => transferOperationStore.resultTable,
    saveProvider.create("TransferZakazTableSettings"),
);
export default tableData;



// new BaseColumnString<TLead, "section">("section", "Источник"),
// new BaseColumnString<TLead, "first_referrer">("first_referrer", "первый реферер"),
// new BaseColumnString<TLead, "firstPage">("firstPage", "страница входа"),