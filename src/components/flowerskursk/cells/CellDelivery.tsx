"use client";

import { observer } from "mobx-react-lite";
import { Badge, Flex, Text } from "@radix-ui/themes";

export interface TDeliveryCellData {
    type: string;
    address?: string | null;
    date?: string | null;
    timeSlot?: string | null;
}

export const CellDelivery = observer(({ value }: { value: TDeliveryCellData | string }) => {
    if (typeof value === "string") {
        return <div>{value || "—"}</div>;
    }

    const { type, address, date, timeSlot } = value || {};
    const isPickup = type === "pickup";

    return (
        <Flex direction="column" gap="1" style={{ minWidth: 160 }}>
            <Flex align="center" gap="1">
                <Badge color={isPickup ? "amber" : "teal"} size="1" variant="soft">
                    {isPickup ? "Самовывоз" : "Курьер"}
                </Badge>
                {date && (
                    <Badge color="gray" size="1" variant="outline">
                        {date}
                    </Badge>
                )}
            </Flex>

            {timeSlot && (
                <Text size="1" color="indigo" weight="medium">
                    Время: {timeSlot}
                </Text>
            )}

            {!isPickup && address && (
                <Text size="1" color="gray" style={{ maxWidth: 220, wordBreak: "break-word" }}>
                    {address}
                </Text>
            )}
        </Flex>
    );
});

export default CellDelivery;
