"use client";

import { observer } from "mobx-react-lite";
import { Flex, Badge, Text } from "@radix-ui/themes";

export interface TFlagsCellData {
    callBeforeDelivery: boolean;
    photoBeforeDelivery: boolean;
    isAnonymous: boolean;
    customerNotes?: string | null;
    adminNotes?: string | null;
}

export const CellFlags = observer(({ value }: { value: TFlagsCellData | string }) => {
    if (typeof value === "string") {
        return <div style={{ fontSize: "12px" }}>{value || "—"}</div>;
    }

    const { callBeforeDelivery, photoBeforeDelivery, isAnonymous, customerNotes, adminNotes } = value || {};

    const hasAny = callBeforeDelivery || photoBeforeDelivery || isAnonymous || customerNotes || adminNotes;
    if (!hasAny) {
        return <Text size="1" color="gray">—</Text>;
    }

    return (
        <Flex direction="column" gap="1" style={{ minWidth: 150, maxWidth: 240 }}>
            <Flex wrap="wrap" gap="1">
                {photoBeforeDelivery && (
                    <Badge color="cyan" size="1" variant="soft">
                        📸 Фото перед отправкой
                    </Badge>
                )}
                {callBeforeDelivery && (
                    <Badge color="indigo" size="1" variant="soft">
                        📞 Звонок перед выездом
                    </Badge>
                )}
                {isAnonymous && (
                    <Badge color="gray" size="1" variant="solid">
                        🕶️ Анонимно
                    </Badge>
                )}
            </Flex>

            {customerNotes && (
                <Text size="1" color="gray" style={{ fontStyle: "italic", wordBreak: "break-word" }}>
                    Клиент: {customerNotes}
                </Text>
            )}

            {adminNotes && (
                <Text size="1" color="crimson" weight="medium" style={{ wordBreak: "break-word" }}>
                    Админ: {adminNotes}
                </Text>
            )}
        </Flex>
    );
});

export default CellFlags;
