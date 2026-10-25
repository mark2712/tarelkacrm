"use client";

import { observer } from "mobx-react-lite";
import { Badge, Flex, Text, Link } from "@radix-ui/themes";

export interface TRecipientCellData {
    isRecipientOther: boolean;
    name?: string | null;
    phone?: string | null;
    isAnonymous?: boolean;
}

export const CellRecipient = observer(({ value }: { value: TRecipientCellData | string }) => {
    if (typeof value === "string") {
        return <div>{value || "—"}</div>;
    }

    const { isRecipientOther, name, phone, isAnonymous } = value || {};

    if (!isRecipientOther && !name && !phone) {
        return (
            <Text size="2" color="gray">
                Заказчик получает сам
            </Text>
        );
    }

    return (
        <Flex direction="column" gap="1" style={{ minWidth: 140 }}>
            <Flex align="center" gap="1">
                <Badge color="plum" size="1" variant="surface">
                    В подарок
                </Badge>
                {isAnonymous && (
                    <Badge color="gray" size="1" variant="solid">
                        Анонимно
                    </Badge>
                )}
            </Flex>
            <Text weight="medium" size="2">
                {name || "Имя не указано"}
            </Text>
            {phone && (
                <Link href={`tel:${phone.replace(/[^\d+]/g, "")}`} size="1" color="blue">
                    {phone}
                </Link>
            )}
        </Flex>
    );
});

export default CellRecipient;
