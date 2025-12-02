"use client";

import { observer } from "mobx-react-lite";
import { CheckboxCards, Flex, Text, Card, Switch } from "@radix-ui/themes";
import operationCSS from "../operation.module.css";


export const OperationComponent = observer(({ operation }: any) => {
    const Options = operation.OptionsComponent;

    return (
        <Card variant="surface" className={operationCSS.Operation}>
            <Flex justify="start" align="center" mb="2">
                {/* Переключение операции */}
                <Switch size="3"
                    checked={operation.enabled}
                    onCheckedChange={(v) => operation.setEnabled(Boolean(v))}
                    className={operationCSS.Switch}
                />
                <Text size="3" weight="bold">{operation.label}</Text>
            </Flex>

            {/* Опции (если есть) */}
            {operation.enabled && Options && (
                <div style={{ marginTop: 12 }}>
                    <Options operation={operation} />
                </div>
            )}
        </Card>
    );
});

export default OperationComponent;



// если нужено без дизайна
// export const Operation = observer(({ operation }) => {
//     const Options = operation.OptionsComponent;

//     return (
//         <div style={{ marginBottom: 16 }}>
//             <label>
//                 <input
//                     type="checkbox"
//                     checked={operation.enabled}
//                     onChange={e => (operation.setEnabled(e.target.checked))}
//                 />
//                 {operation.label}
//             </label>

//             {Options && <Options operation={operation} />}
//         </div>
//     );
// });