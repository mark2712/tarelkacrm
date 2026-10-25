"use client";

import { observer } from "mobx-react-lite";
import { Badge } from "@radix-ui/themes";

export const statusMap: Record<string, { label: string; color: "blue" | "purple" | "amber" | "cyan" | "green" | "red" | "gray" }> = {
    new: { label: "Новый", color: "blue" },
    confirmed: { label: "Подтвержден", color: "purple" },
    assembling: { label: "Сборка", color: "amber" },
    delivering: { label: "Доставка", color: "cyan" },
    completed: { label: "Выполнен", color: "green" },
    cancelled: { label: "Отменен", color: "red" },
};

export const CellStatus = observer(({ value }: { value: string }) => {
    const info = statusMap[value] || { label: value || "—", color: "gray" as const };

    return (
        <Badge color={info.color} size="2" variant="surface" style={{ fontWeight: 600 }}>
            {info.label}
        </Badge>
    );
});

export default CellStatus;
