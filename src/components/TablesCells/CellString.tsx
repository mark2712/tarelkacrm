import { observer } from "mobx-react";


export const CellString = observer(({ value }) => {
    return (
        <div>{value}</div>
    )
});

export default CellString;