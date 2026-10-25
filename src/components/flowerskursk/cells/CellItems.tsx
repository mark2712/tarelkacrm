"use client";

import { observer } from "mobx-react-lite";
import { Flex, Text, Box } from "@radix-ui/themes";
import { FlowersOrderItemRaw } from "../store/FlowersStoreApi";

export const CellItems = observer(({ value }: { value: FlowersOrderItemRaw[] | string }) => {
    if (typeof value === "string") {
        return <div style={{ maxWidth: 260, fontSize: "13px" }}>{value || "—"}</div>;
    }

    if (!Array.isArray(value) || value.length === 0) {
        return <Text size="1" color="gray">—</Text>;
    }

    return (
        <Flex direction="column" gap="2" style={{ minWidth: 200, maxWidth: 300, padding: "4px 0" }}>
            {value.map((item, idx) => {
                const img = item.image || item.image_url;
                const price = Number(item.price || 0);
                const qty = Number(item.quantity || 1);

                return (
                    <Flex key={idx} align="center" gap="2">
                        {img ? (
                            <img
                                src={img}
                                alt={item.name || "Букет"}
                                style={{
                                    width: 36,
                                    height: 36,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                    border: "1px solid var(--gray-5)",
                                    flexShrink: 0,
                                }}
                            />
                        ) : (
                            <Box
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 6,
                                    backgroundColor: "var(--gray-4)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "10px",
                                    color: "var(--gray-9)",
                                    flexShrink: 0,
                                }}
                            >
                                🌸
                            </Box>
                        )}
                        <Flex direction="column" style={{ minWidth: 0 }}>
                            <Text size="1" weight="medium" style={{ lineHeight: 1.2, wordBreak: "break-word" }}>
                                {item.name || "Товар"}
                            </Text>
                            <Text size="1" color="gray">
                                {qty} шт. × {price.toLocaleString("ru-RU")} ₽
                            </Text>
                        </Flex>
                    </Flex>
                );
            })}
        </Flex>
    );
});

export default CellItems;
