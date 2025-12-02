import { Contact, googleTableStore } from "../store/GoogleTableStore";
import { TableData } from "@/components/common/Table/TableData";
import CellString from "@/components/common/TablesCells/CellString";
import BaseColumnPhoto from "@/components/common/TablesCells/CellPhoto";
import { BaseColumn } from "@/components/common/Table/ColumnsStore";
import { SaveProvider } from "@/common/saveData/SaveProvider";


const tableData = new TableData(
    [
        new BaseColumn<Contact, "name">("name", CellString).Title("Имя"),
        new BaseColumn<Contact, "email">("email", CellString).Title("Email"),
        new BaseColumn<Contact, "phone">("phone", CellString).Title("Телефон"),
        new BaseColumn<Contact, "organization">("organization", CellString).Title("Организация"),
        new BaseColumn<Contact, "note">("note", CellString).Title("Комментарий"),
        new BaseColumn<Contact, "address">("address", CellString).Title("Адрес"),
        new BaseColumn<Contact, "nickname">("nickname", CellString).Title("Псевдоним"),
        new BaseColumn<Contact, "birthday">("birthday", CellString).Title("День рождения"),
        new BaseColumn<Contact, "gender">("gender", CellString).Title("Пол"),
        new BaseColumn<Contact, "photo">("photo", BaseColumnPhoto).Title("Фото"),
        new BaseColumn<Contact, "relation">("relation", CellString).Title("Отношения"),
        new BaseColumn<Contact, "event">("event", CellString).Title("События"),
        new BaseColumn<Contact, "url">("url", CellString).Title("Ссылки"),
        new BaseColumn<Contact, "userDefined">("userDefined", CellString).Title("Пользовательские поля"),
        new BaseColumn<Contact, "labels">("labels", CellString).Title("Ярлыки"),
    ],
    () => googleTableStore.resultTable,
    new SaveProvider("ContactsTableSettings"),
);
export default tableData;
