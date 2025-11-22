"use client";

import { observer } from "mobx-react-lite";
import { TLead } from "../store/TransferTableStore";
import { Operation } from "@/components/Table/Operations/store/Operation";
import { CheckboxCards, Flex, Text, Card, Switch, TextField, Separator } from "@radix-ui/themes";
import operationCSS from "@/components/Table/Operations/operation.module.css";


interface TPeopleFilter { min: number | null; max: number | null; excludeEmpty: boolean };

export class PeopleFilter extends Operation<TLead, TPeopleFilter> {
    constructor() {
        super("PeopleFilter", "Фильтр по количеству человек", PeopleFilterOptions);

        this.options = {
            min: null,
            max: null,
            excludeEmpty: false,
        };
    }

    override apply() {
        const { min, max, excludeEmpty } = this.options;

        return this.data.filter(x => {
            const match = x.calc_all?.match(/человек:\s*(\d+)/i);

            // если количество людей не указано
            if (!match) {
                return excludeEmpty ? false : true;
            }

            const people = Number(match[1]);
            if (isNaN(people)) return excludeEmpty ? false : true;

            if (min != null && people < min) return false;
            if (max != null && people > max) return false;

            return true;
        });
    }
}


export const PeopleFilterOptions = observer(({ operation }: any) => {
    const options: TPeopleFilter = operation.options;
    const { min, max, excludeEmpty } = options;

    return (
        <Flex gap="3" className={operationCSS.FlexOptions}>
            {/* первая строка: мин и макс */}
            <Flex align="center" gap="4">
                <Flex align="center" gap="2">
                    <Text>Мин:</Text>
                    <TextField.Root
                        value={min ?? ""}
                        type="number"
                        style={{ width: 100 }}
                        onChange={(e) =>
                            operation.setOptions({
                                ...operation.options,
                                min: e.target.value === "" ? null : Number(e.target.value),
                            })
                        }
                    />
                </Flex>

                <Flex align="center" gap="2">
                    <Text>Макс:</Text>
                    <TextField.Root
                        value={max ?? ""}
                        type="number"
                        style={{ width: 100 }}
                        onChange={(e) =>
                            operation.setOptions({
                                ...operation.options,
                                max: e.target.value === "" ? null : Number(e.target.value),
                            })
                        }
                    />
                </Flex>
            </Flex>

            <Separator orientation="vertical" />

            {/* чекбокс — одной строкой */}
            <CheckboxCards.Root
                value={excludeEmpty ? ["missing"] : []}
                onValueChange={(values) => {
                    operation.setOptions({
                        ...operation.options,
                        excludeEmpty: values.includes("missing"),
                    });
                }}
                size="2"
                className={operationCSS.CheckboxCard}
            >
                <CheckboxCards.Item value="missing">
                    Фильтровать строки без количества людей
                </CheckboxCards.Item>
            </CheckboxCards.Root>
        </Flex>
    );
});