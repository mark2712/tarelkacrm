"use client";

import { observer } from "mobx-react-lite";
import { Badge, Flex, Text } from "@radix-ui/themes";

const paymentStatusMap: Record<string, { label: string; color: "green" | "amber" | "red" | "gray" }> = {
    paid: { label: "Оплачен", color: "green" },
    pending: { label: "Ожидает", color: "amber" },
    failed: { label: "Ошибка", color: "red" },
    refunded: { label: "Возврат", color: "gray" },
};

const paymentMethodMap: Record<string, string> = {
    online: "Онлайн",
    online_robokassa: "Онлайн (Robokassa)",
    sbp: "СБП",
    sber_transfer: "Сбербанк Онлайн",
    card_courier: "Картой курьеру",
    card_on_delivery: "Картой при получении",
    cash: "Наличные",
    cash_on_delivery: "Наличные при получении",
};

export interface TPaymentCellData {
    status: string;
    method: string;
    paidAt?: string | null;
}

export const CellPayment = observer(({ value }: { value: TPaymentCellData | string }) => {
    if (typeof value === "string") {
        const info = paymentStatusMap[value] || { label: value || "—", color: "gray" as const };
        return <Badge color={info.color} size="1" variant="soft">{info.label}</Badge>;
    }

    const { status, method } = value || {};
    const statusInfo = paymentStatusMap[status] || { label: status || "Не указан", color: "gray" as const };
    const methodLabel = paymentMethodMap[method] || method || "—";

    return (
        <Flex direction="column" gap="1" style={{ minWidth: 100 }}>
            <Badge color={statusInfo.color} size="1" variant="solid" style={{ width: "fit-content" }}>
                {statusInfo.label}
            </Badge>
            <Text size="1" color="gray" style={{ whiteSpace: "nowrap" }}>
                {methodLabel}
            </Text>
        </Flex>
    );
});

export default CellPayment;
