"use client";

import { ApiStore } from "@/common/api/ApiStore";
import { observer } from "mobx-react-lite";
// import { useEffect } from "react";
import { InfoCircledIcon, TimerIcon, Link2Icon } from "@radix-ui/react-icons";
import { Callout, Separator, Flex, Strong } from "@radix-ui/themes";


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

    // useEffect(() => {
    //     if (autoLoad && !store.data) store.load();
    // }, [autoLoad, store]);

    const count = Array.isArray(store.data) ? store.data.length : undefined;

    const callout = (<Callout.Root color="gray" mt="2" style={{ margin: "10px" }}>
        <Flex align="center" gap="3">
            <Flex align="center">
                <Callout.Icon style={{ marginRight: "4px" }} ><InfoCircledIcon /></Callout.Icon>
                <Callout.Text>{label ?? "Загружено элементов"}:  <Strong>{count ?? "—"}</Strong></Callout.Text>
            </Flex>
            <Separator orientation="vertical" />
            <Flex align="center">
                <Callout.Icon style={{ marginRight: "4px" }} ><TimerIcon /></Callout.Icon>
                <Callout.Text>Время загрузки: <Strong>{store.loadTime ? store.loadTime.toFixed(3) + " сек" : "—"}</Strong></Callout.Text>
            </Flex>
            <Separator orientation="vertical" />
            <Flex align="center">
                <Callout.Icon style={{ marginRight: "4px" }} ><Link2Icon /></Callout.Icon>
                <Callout.Text>Страница api: <Strong>{store.endpoint}</Strong></Callout.Text>
            </Flex>
        </Flex>
    </Callout.Root >);


    // ----- авто-режим -----
    if (autoLoad) {
        if (store.loading) {
            return (callout);
        } else {
            if (!store.firstLoadingEnd) {
                store.load();
            }
        }
        return (callout);
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

            {!store.loading && store.data && (callout)}
        </div>
    );
});