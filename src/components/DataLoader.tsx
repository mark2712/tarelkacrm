"use client";
import { ApiStore } from "@/store/api/ApiStore";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { Callout, Separator, Flex } from "@radix-ui/themes";


interface DataLoaderProps<T> {
    store: ApiStore<T>;
    autoLoad?: boolean;
    label?: string;
}

export const DataLoader = observer(<T,>({
    store,
    autoLoad = false,
    label
}: DataLoaderProps<T>) => {

    useEffect(() => {
        if (autoLoad && !store.data) store.load();
    }, [autoLoad, store]);

    const count = Array.isArray(store.data) ? store.data.length : undefined;

    // ----- авто-режим -----
    if (autoLoad) {
        if (store.loading) return (
            <Callout.Root color="gray" mt="2" style={{ margin: "10px" }}>
                <Callout.Icon />
                <Flex align="center" gap="3">
                    <Callout.Text>Загрузка...</Callout.Text>
                    <Separator orientation="vertical" />
                    <Callout.Text>{store.endpoint}</Callout.Text>
                </Flex>
            </Callout.Root>
        );

        return (
            <Callout.Root color="gray" mt="2" style={{ margin: "10px" }}>
                <Callout.Icon />
                <Flex align="center" gap="3">
                    <Callout.Text>
                        <strong>{label ?? "Элементов"}:</strong> {count ?? "—"}
                    </Callout.Text>
                    <Separator orientation="vertical" />
                    <Callout.Text>
                        <strong>Время загрузки:</strong>{" "}
                        {store.loadTime ? store.loadTime.toFixed(3) + " сек" : "—"}
                    </Callout.Text>
                    <Separator orientation="vertical" />
                    <Callout.Text><strong>Страница: </strong>{store.endpoint}</Callout.Text>
                </Flex>
            </Callout.Root>
        );
    }

    // ----- ручной режим -----
    return (
        <div>
            <button
                onClick={() => store.load()}
                disabled={store.loading}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
                {store.loading ? "Загрузка..." : "Загрузить"}
            </button>

            {!store.loading && store.data && (
                <Callout.Root color="gray" mt="3">
                    <Callout.Icon />
                    <Flex align="center" gap="3">
                        <Callout.Text>
                            <strong>{label ?? "Элементов"}:</strong> {count ?? "—"}
                        </Callout.Text>

                        <Separator orientation="vertical" />

                        <Callout.Text>
                            <strong>Время загрузки:</strong>{" "}
                            {store.loadTime ? store.loadTime.toFixed(3) + " сек" : "—"}
                        </Callout.Text>
                    </Flex>
                </Callout.Root>
            )}
        </div>
    );
});