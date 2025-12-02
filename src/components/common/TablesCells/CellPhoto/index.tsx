import { observer } from "mobx-react-lite";
import css from "./css.module.css";


export const CellPhoto = observer(({ value }: { value: string }) => {
    return (
        <img src={value} alt="фото контакта" className={css.photo} />
    )
});

export default CellPhoto;