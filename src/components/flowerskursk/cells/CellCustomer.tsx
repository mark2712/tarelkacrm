"use client";

import { observer } from "mobx-react-lite";
import { Flex, Text, Link } from "@radix-ui/themes";

export interface TCustomerCellData {
    name: string;
    phone: string;
    email?: string | null;
}

export const CellCustomer = observer(({ value }: { value: TCustomerCellData | string }) => {
    if (typeof value === "string") {
        return <div>{value || "—"}</div>;
    }

    const { name, phone, email } = value || {};

    return (
        <Flex direction="column" gap="1" style={{ minWidth: 140 }}>
            <Text weight="bold" size="2">
                {name || "Без имени"}
            </Text>
            {phone && (
                <Link href={`tel:${phone.replace(/[^\d+]/g, "")}`} size="1" color="blue">
                    {phone}
                </Link>
            )}
            {email && (
                <Text size="1" color="gray">
                    {email}
                </Text>
            )}
        </Flex>
    );
});

export default CellCustomer;
