"use client";

import { Operation } from "@/components/common/Table/Operations/store/Operation";
import { observer } from "mobx-react-lite";
import { CheckboxCards, Flex, Separator, Text } from "@radix-ui/themes";
import operationCSS from "@/components/common/Table/Operations/operation.module.css";
import type { TFlowersOrder } from "../store/FlowersTableStore";

export interface IPaymentFilterOptions {
    paymentStatuses: string[];
    paymentMethods: string[];
}

export class PaymentFilter extends Operation<TFlowersOrder, IPaymentFilterOptions> {
    constructor() {
        super("PaymentFilter", "Фильтр оплаты", PaymentFilterOptions);

        this.options = {
            paymentStatuses: ["paid", "pending", "failed", "refunded"],
            paymentMethods: ["online", "online_robokassa", "sbp", "sber_transfer", "card_courier", "card_on_delivery", "cash", "cash_on_delivery"],
        };
    }

    override apply() {
        const { paymentStatuses, paymentMethods } = this.options;

        return this.data.filter((order) => {
            if (paymentStatuses && paymentStatuses.length > 0) {
                if (!paymentStatuses.includes(order.paymentStatus)) {
                    return false;
                }
            }

            if (paymentMethods && paymentMethods.length > 0) {
                if (!paymentMethods.includes(order.paymentMethod)) {
                    return false;
                }
            }

            return true;
        });
    }
}

export const PaymentFilterOptions = observer(
    ({ operation }: { operation: Operation<TFlowersOrder, IPaymentFilterOptions> }) => {
        const { paymentStatuses = [], paymentMethods = [] } = operation.options || {};

        return (
            <Flex gap="3" align="center" className={operationCSS.FlexOptions}>
                <Flex align="center" gap="2">
                    <Text size="1" weight="medium" color="gray">
                        Статус:
                    </Text>
                    <CheckboxCards.Root
                        value={paymentStatuses}
                        onValueChange={(values) => {
                            operation.setOptions({
                                ...operation.options,
                                paymentStatuses: values,
                            });
                        }}
                        size="1"
                        className={operationCSS.CheckboxCard}
                    >
                        <CheckboxCards.Item value="paid">Оплачен</CheckboxCards.Item>
                        <CheckboxCards.Item value="pending">Ожидает</CheckboxCards.Item>
                        <CheckboxCards.Item value="failed">Ошибка</CheckboxCards.Item>
                        <CheckboxCards.Item value="refunded">Возврат</CheckboxCards.Item>
                    </CheckboxCards.Root>
                </Flex>

                <Separator orientation="vertical" />

                <Flex align="center" gap="2">
                    <Text size="1" weight="medium" color="gray">
                        Способ:
                    </Text>
                    <CheckboxCards.Root
                        value={paymentMethods}
                        onValueChange={(values) => {
                            operation.setOptions({
                                ...operation.options,
                                paymentMethods: values,
                            });
                        }}
                        size="1"
                        className={operationCSS.CheckboxCard}
                    >
                        <CheckboxCards.Item value="online">Онлайн</CheckboxCards.Item>
                        <CheckboxCards.Item value="sbp">СБП</CheckboxCards.Item>
                        <CheckboxCards.Item value="sber_transfer">Сбербанк</CheckboxCards.Item>
                        <CheckboxCards.Item value="card_courier">Картой курьеру</CheckboxCards.Item>
                        <CheckboxCards.Item value="cash">Наличные</CheckboxCards.Item>
                    </CheckboxCards.Root>
                </Flex>
            </Flex>
        );
    }
);

export default PaymentFilter;
