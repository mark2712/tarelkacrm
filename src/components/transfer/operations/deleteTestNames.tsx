"use client";

import { Operation } from "@/components/Table/Operations/store/Operation";
import { TLead } from "../store/TransferTableStore";
import { observer } from "mobx-react-lite";
import { CheckboxCards, Flex, Text, Card, Switch } from "@radix-ui/themes";
import operationCSS from "@/components/Table/Operations/operation.module.css";


interface IDeleteTestNamesOptions { caseSensitive: boolean };

export class DeleteTestNames extends Operation<TLead, IDeleteTestNamesOptions> {
    constructor() {
        super("DeleteTestNames", "Убрать тестовые лиды", DeleteTestNamesOptions);

        this.options = {
            caseSensitive: false
        };
    }

    override apply() {
        const isCS = this.options.caseSensitive;

        return this.data.filter(x => {
            let name = x.name1 ?? "";
            if (!isCS) name = name.toLowerCase();
            return !name.includes("тест");
        });
    }
}


export const DeleteTestNamesOptions = observer(({ operation }: any) => {
    const { caseSensitive }: IDeleteTestNamesOptions = operation.options;

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


