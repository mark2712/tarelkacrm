"use client";

import React from "react";
import { observer } from "mobx-react-lite";
import { Badge, Box, Flex, Text } from "@radix-ui/themes";

export interface SoundproofingOrderItem {
    id?: number | string;
    slug?: string;
    title?: string;
    sku?: string;
    price?: number;
    priceUnit?: string;
    quantity?: number;
    cost?: number;
}

export interface SoundproofingShopCartData {
    items?: SoundproofingOrderItem[];
    totalCount?: number;
    totalPrice?: number;
    deliveryType?: "delivery" | "pickup" | string;
    deliveryAddress?: string;
}

export interface SoundproofingShopOneClickData {
    items?: SoundproofingOrderItem[];
    totalCount?: number;
    totalPrice?: number;
}

interface ParsedOtherData {
    shop_cart_v1?: SoundproofingShopCartData;
    shop_one_click_v1?: SoundproofingShopOneClickData;
    items?: SoundproofingOrderItem[];
    totalCount?: number;
    totalPrice?: number;
    [key: string]: any;
}

const OrderItemsList = ({ items }: { items: SoundproofingOrderItem[] }) => {
    if (!items || items.length === 0) return null;

    return (
        <Flex direction="column" gap="1" style={{ marginTop: 4 }}>
            {items.map((item, idx) => {
                const qty = item.quantity ?? 1;
                const unit = item.priceUnit || "шт";
                const price = item.price;
                const cost = item.cost ?? (price !== undefined ? price * qty : undefined);

                return (
                    <Box
                        key={item.id ?? idx}
                        style={{
                            padding: "4px 6px",
                            borderRadius: "6px",
                            backgroundColor: "var(--gray-a2)",
                            fontSize: "12px",
                            border: "1px solid var(--gray-a4)",
                        }}
                    >
                        <Flex justify="between" align="start" gap="2">
                            <Text size="1" weight="medium" style={{ lineHeight: 1.25, wordBreak: "break-word" }}>
                                {item.title || "Товар"}
                            </Text>
                            {item.sku && (
                                <Text size="1" color="gray" style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                                    арт. {item.sku}
                                </Text>
                            )}
                        </Flex>
                        <Flex justify="between" align="center" gap="2" style={{ marginTop: 2 }}>
                            <Text size="1" color="gray" style={{ fontSize: "11px" }}>
                                {qty} {unit}
                                {price !== undefined && ` × ${price.toLocaleString("ru-RU")} ₽`}
                            </Text>
                            {cost !== undefined && (
                                <Text size="1" weight="medium" style={{ whiteSpace: "nowrap" }}>
                                    {cost.toLocaleString("ru-RU")} ₽
                                </Text>
                            )}
                        </Flex>
                    </Box>
                );
            })}
        </Flex>
    );
};

const OrderSummary = ({ totalCount, totalPrice, items }: { totalCount?: number; totalPrice?: number; items?: SoundproofingOrderItem[] }) => {
    const calculatedCount = totalCount ?? items?.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const calculatedPrice = totalPrice ?? items?.reduce((acc, it) => acc + (it.cost ?? ((it.price || 0) * (it.quantity || 1))), 0);

    return (
        <Flex
            justify="between"
            align="center"
            style={{
                marginTop: 4,
                padding: "3px 6px",
                borderTop: "1px dashed var(--gray-6)",
            }}
        >
            <Text size="1" color="gray" style={{ fontSize: "11px" }}>
                Всего: {calculatedCount ?? 0} шт.
            </Text>
            {calculatedPrice !== undefined && (
                <Text size="1" weight="bold" color="green" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                    Итого: {calculatedPrice.toLocaleString("ru-RU")} ₽
                </Text>
            )}
        </Flex>
    );
};

export const CellOtherData = observer(({ value }: { value: string | null | undefined }) => {
    if (!value || (typeof value === "string" && !value.trim())) {
        return <span style={{ color: "var(--gray-8)" }}>—</span>;
    }

    let parsed: ParsedOtherData | null = null;
    let isJson = false;

    if (typeof value === "object" && value !== null) {
        parsed = value as ParsedOtherData;
        isJson = true;
    } else if (typeof value === "string") {
        try {
            parsed = JSON.parse(value);
            isJson = true;
        } catch {
            parsed = null;
            isJson = false;
        }
    }

    // Случай 1: shop_cart_v1
    if (parsed && parsed.shop_cart_v1) {
        const cart = parsed.shop_cart_v1;
        const items = cart.items || [];
        const isPickup = cart.deliveryType === "pickup";
        const isDelivery = cart.deliveryType === "delivery";

        return (
            <Flex direction="column" gap="1" style={{ minWidth: 220, maxWidth: 340, padding: "4px 2px" }}>
                <Flex align="center" gap="1" wrap="wrap">
                    <Badge color="purple" variant="soft" size="1">
                        🛒 Корзина
                    </Badge>
                    {isDelivery && (
                        <Badge color="blue" variant="surface" size="1">
                            🚚 Доставка
                        </Badge>
                    )}
                    {isPickup && (
                        <Badge color="amber" variant="surface" size="1">
                            🏢 Самовывоз
                        </Badge>
                    )}
                    {!isDelivery && !isPickup && cart.deliveryType && (
                        <Badge color="gray" variant="surface" size="1">
                            {cart.deliveryType}
                        </Badge>
                    )}
                </Flex>

                {cart.deliveryAddress && (
                    <Text size="1" color="gray" style={{ fontSize: "11px", wordBreak: "break-word", lineHeight: 1.25 }}>
                        📍 {cart.deliveryAddress}
                    </Text>
                )}

                <OrderItemsList items={items} />
                <OrderSummary totalCount={cart.totalCount} totalPrice={cart.totalPrice} items={items} />
            </Flex>
        );
    }

    // Случай 2: shop_one_click_v1
    if (parsed && parsed.shop_one_click_v1) {
        const oneClick = parsed.shop_one_click_v1;
        const items = oneClick.items || [];

        return (
            <Flex direction="column" gap="1" style={{ minWidth: 220, maxWidth: 340, padding: "4px 2px" }}>
                <Flex align="center" gap="1">
                    <Badge color="cyan" variant="soft" size="1">
                        ⚡ Купить в 1 клик
                    </Badge>
                </Flex>

                <OrderItemsList items={items} />
                <OrderSummary totalCount={oneClick.totalCount} totalPrice={oneClick.totalPrice} items={items} />
            </Flex>
        );
    }

    // Случай 3: Прямой формат с items
    if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
        return (
            <Flex direction="column" gap="1" style={{ minWidth: 220, maxWidth: 340, padding: "4px 2px" }}>
                <Flex align="center" gap="1">
                    <Badge color="blue" variant="soft" size="1">
                        📦 Заказ
                    </Badge>
                </Flex>

                <OrderItemsList items={parsed.items} />
                <OrderSummary totalCount={parsed.totalCount} totalPrice={parsed.totalPrice} items={parsed.items} />
            </Flex>
        );
    }

    // Стандартный вывод для любого другого JSON или обычного текста
    const textContent = isJson && typeof parsed === "object"
        ? JSON.stringify(parsed, null, 2)
        : String(value);

    return (
        <div
            style={{
                maxWidth: 280,
                fontSize: "12px",
                lineHeight: 1.3,
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                fontFamily: isJson ? "monospace" : "inherit",
            }}
        >
            {textContent}
        </div>
    );
});

export default CellOtherData;
