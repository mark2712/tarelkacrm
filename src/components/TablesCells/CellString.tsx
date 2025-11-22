import { observer } from "mobx-react-lite";


export const CellString = observer(({ value }: { value: string }) => {
    return (
        <div>{value}</div>
    )
});

export default CellString;