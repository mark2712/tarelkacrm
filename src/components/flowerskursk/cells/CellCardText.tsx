"use client";

import { observer } from "mobx-react-lite";
import { Flex, Text, Box } from "@radix-ui/themes";

export const CellCardText = observer(({ value }: { value: string }) => {
    if (!value || !value.trim()) {
        return <Text size="1" color="gray">Без открытки</Text>;
    }

    return (
        <Box
            style={{
                maxWidth: 220,
                padding: "4px 8px",
                borderRadius: "6px",
                backgroundColor: "var(--amber-2)",
                border: "1px dashed var(--amber-7)",
            }}
        >
            <Flex align="center" gap="1" mb="1">
                <Text size="1" color="amber" weight="bold">
                    💌 Открытка:
                </Text>
            </Flex>
            <Text size="1" color="amber" style={{ fontStyle: "italic", wordBreak: "break-word" }}>
                «{value}»
            </Text>
        </Box>
    );
});

export default CellCardText;
