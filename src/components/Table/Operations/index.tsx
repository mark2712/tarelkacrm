"use client";

import { observer } from "mobx-react-lite";
import Operation from "./Operation";
import operationCSS from "./operation.module.css";


export const Operations = observer(({ operations }: any) => (
    <div className={operationCSS.Operations} >
        {operations.map((op: any) => <Operation key={op.id} operation={op} />)}
    </div>
));

export default Operations;