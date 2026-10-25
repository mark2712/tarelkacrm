"use client";

import { Operation } from "@/components/common/Table/Operations/store/Operation";
import { observer } from "mobx-react-lite";
import { CheckboxCards } from "@radix-ui/themes";
import operationCSS from "@/components/common/Table/Operations/operation.module.css";
import type { TFlowersOrder } from "../store/FlowersTableStore";

export interface IStatusFilterOptions {
    statuses: string[];
}

export class StatusFilter extends Operation<TFlowersOrder, IStatusFilterOptions> {
    constructor() {
        super("StatusFilter", "Статус заказа", StatusFilterOptions);

        this.options = {
            statuses: ["new", "confirmed", "assembling", "delivering", "completed"],
        };
    }

    override apply() {
        const { statuses } = this.options;
        if (!statuses || statuses.length === 0) return this.data;

        return this.data.filter((order) => {
            return statuses.includes(order.status);
        });
    }
}

export const StatusFilterOptions = observer(
    ({ operation }: { operation: Operation<TFlowersOrder, IStatusFilterOptions> }) => {
        const statuses = operation.options?.statuses || [];

        return (
            <CheckboxCards.Root
                value={statuses}
                onValueChange={(values) => {
                    operation.setOptions({
                        ...operation.options,
                        statuses: values,
                    });
                }}
                size="1"
                className={operationCSS.CheckboxCard}
            >
                <CheckboxCards.Item value="new">Новый</CheckboxCards.Item>
                <CheckboxCards.Item value="confirmed">Подтвержден</CheckboxCards.Item>
                <CheckboxCards.Item value="assembling">Сборка</CheckboxCards.Item>
                <CheckboxCards.Item value="delivering">Доставка</CheckboxCards.Item>
                <CheckboxCards.Item value="completed">Выполнен</CheckboxCards.Item>
                <CheckboxCards.Item value="cancelled">Отменен</CheckboxCards.Item>
            </CheckboxCards.Root>
        );
    }
);

export default StatusFilter;
