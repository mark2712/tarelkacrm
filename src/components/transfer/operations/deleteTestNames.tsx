import { Operation } from "@/store/operations/Operation";
import { ProcessedLead } from "../store/TransferTableStore";
import { observer } from "mobx-react";
import { CheckboxCards, Flex, Text, Card, Switch } from "@radix-ui/themes";
import operationCSS from "@/components/Table/Operations/operation.module.css";


export class DeleteTestNames extends Operation<ProcessedLead, { caseSensitive: boolean }> {
    constructor() {
        super("DeleteTestNames", "Убрать тестовые лиды", DeleteTestNamesOptions);

        this.options = {
            caseSensitive: false
        };
    }

    apply() {
        const isCS = this.options.caseSensitive;

        return this.data.filter(x => {
            let name = x.name1 ?? "";
            if (!isCS) name = name.toLowerCase();
            return !name.includes("тест");
        });
    }
}


export const DeleteTestNamesOptions = observer(({ operation }) => {
    const { caseSensitive } = operation.options;

    return (
        <CheckboxCards.Root
            value={caseSensitive ? ["case"] : []}
            onValueChange={(val) => {
                operation.setOptions({
                    ...operation.options,
                    caseSensitive: val.includes("case")
                })
            }}
            size="2"
            className={operationCSS.CheckboxCard}
        >
            <CheckboxCards.Item value="case">
                Учитывать регистр
            </CheckboxCards.Item>
        </CheckboxCards.Root>
    );
});


// export const DeleteTestNamesOptions = observer(({ operation }) => {
//     const onChange = (e: { target: { checked: any; }; }) => {
//         operation.setOptions({
//             ...operation.options,
//             caseSensitive: e.target.checked
//         });
//     };

//     return (
//         <label>
//             <input
//                 type="checkbox"
//                 checked={operation.options?.caseSensitive ?? false}
//                 onChange={onChange}
//             /> Учитывать регистр
//         </label>
//     );
// });


