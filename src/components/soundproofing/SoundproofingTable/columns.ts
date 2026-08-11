import { TableData } from "@/components/common/Table/TableData";
import { BaseColumn } from "@/components/common/Table/ColumnsStore";
import { SaveProvider } from "@/common/saveData/SaveProvider";
import CellString from "@/components/common/TablesCells/CellString";
import soundproofingTableStore, { TSoundproofingLead } from "../store/SoundproofingTableStore";

const tableData = new TableData(
    [
        new BaseColumn<TSoundproofingLead, "date">("date", CellString).Title("Дата"),
        new BaseColumn<TSoundproofingLead, "name">("name", CellString).Title("Имя"),
        new BaseColumn<TSoundproofingLead, "phone">("phone", CellString).Title("Телефон"),
        new BaseColumn<TSoundproofingLead, "message">("message", CellString).Title("Сообщение"),
        new BaseColumn<TSoundproofingLead, "section">("section", CellString).Title("Секция"),
        new BaseColumn<TSoundproofingLead, "block">("block", CellString).Title("Блок"),
        new BaseColumn<TSoundproofingLead, "action">("action", CellString).Title("Действие"),
        new BaseColumn<TSoundproofingLead, "geo">("geo", CellString).Title("Регион"),
        new BaseColumn<TSoundproofingLead, "isMob">("isMob", CellString).Title("Мобильный"),
        new BaseColumn<TSoundproofingLead, "url">("url", CellString).Title("URL"),
        new BaseColumn<TSoundproofingLead, "firstReferrer">("firstReferrer", CellString).Title("Реферер"),
        new BaseColumn<TSoundproofingLead, "firstPage">("firstPage", CellString).Title("Страница входа"),
        new BaseColumn<TSoundproofingLead, "otherData">("otherData", CellString).Title("Доп. данные"),
    ],
    () => soundproofingTableStore.resultTable,
    new SaveProvider("SoundproofingTableSettings"),
);
export default tableData;
