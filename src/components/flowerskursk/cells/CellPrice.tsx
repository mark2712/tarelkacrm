"use client";

import { observer } from "mobx-react-lite";
import { Flex, Text, Badge } from "@radix-ui/themes";

export interface TPriceCellData {
    total: number;
    itemsTotal?: number;
    delivery?: number;
    discount?: number;
    promoCode?: string | null;
}

export const CellPrice = observer(({ value }: { value: TPriceCellData | number | string }) => {
    if (typeof value === "number" || typeof value === "string") {
        const num = Number(value);
        return (
            <Text weight="bold" size="2" style={{ whiteSpace: "nowrap" }}>
                {!isNaN(num) ? `${num.toLocaleString("ru-RU")} ₽` : String(value)}
            </Text>
        );
    }

    const { total, itemsTotal, delivery, discount, promoCode } = value || {};

    return (
        <Flex direction="column" gap="1" style={{ minWidth: 100 }}>
            <Text weight="bold" size="3" style={{ whiteSpace: "nowrap", color: "var(--grass-11)" }}>
                {Number(total || 0).toLocaleString("ru-RU")} ₽
            </Text>

            {(delivery || 0) > 0 && (
                <Text size="1" color="gray">
                    Доставка: +{Number(delivery).toLocaleString("ru-RU")} ₽
                </Text>
            )}

            {(discount || 0) > 0 && (
                <Flex align="center" gap="1">
                    <Badge color="red" size="1" variant="soft">
                        -{Number(discount).toLocaleString("ru-RU")} ₽
                    </Badge>
                    {promoCode && (
                        <Text size="1" color="gray">
                            ({promoCode})
                        </Text>
                    )}
                </Flex>
            )}
        </Flex>
    );
});

export default CellPrice;
