import { observer } from "mobx-react";
import { BaseColumn } from "@/components/Table/Columns";
import css from "./css.module.css";


export class BaseColumnPhoto<Row, K extends keyof Row> extends BaseColumn<Row, K, string> {
    constructor(id: K, title: string) {
        super(id, title, CellPhoto);
    }
}

export const CellPhoto = observer(({ value }) => {
    return (
        <img src={value} alt="фото контакта" className={css.photo} />
    )
});

export default BaseColumnPhoto;