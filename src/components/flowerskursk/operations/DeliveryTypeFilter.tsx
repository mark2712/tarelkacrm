"use client";

import { Operation } from "@/components/common/Table/Operations/store/Operation";
import { observer } from "mobx-react-lite";
import { CheckboxCards } from "@radix-ui/themes";
import operationCSS from "@/components/common/Table/Operations/operation.module.css";
import type { TFlowersOrder } from "../store/FlowersTableStore";

export interface IDeliveryTypeFilterOptions {
    types: string[];
}

export class DeliveryTypeFilter extends Operation<TFlowersOrder, IDeliveryTypeFilterOptions> {
    constructor() {
        super("DeliveryTypeFilter", "Тип доставки", DeliveryTypeFilterOptions);

        this.options = {
            types: ["courier", "pickup", "courier_kursk", "courier_region"],
        };
    }

    override apply() {
        const { types } = this.options;
        if (!types || types.length === 0) return this.data;

        return this.data.filter((order) => {
            const dt = order.deliveryType || "courier";
            if (types.includes("courier") && (dt.startsWith("courier") || dt === "courier")) {
                return true;
            }
            return types.includes(dt);
        });
    }
}

export const DeliveryTypeFilterOptions = observer(
    ({ operation }: { operation: Operation<TFlowersOrder, IDeliveryTypeFilterOptions> }) => {
        const types = operation.options?.types || [];

        return (
            <CheckboxCards.Root
                value={types}
                onValueChange={(values) => {
                    operation.setOptions({
                        ...operation.options,
                        types: values,
                    });
                }}
                size="1"
                className={operationCSS.CheckboxCard}
            >
                <CheckboxCards.Item value="courier">Курьерская доставка</CheckboxCards.Item>
                <CheckboxCards.Item value="pickup">Самовывоз</CheckboxCards.Item>
            </CheckboxCards.Root>
        );
    }
);

export default DeliveryTypeFilter;
