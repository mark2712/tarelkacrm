"use client";

import { Operation } from "@/components/common/Table/Operations/store/Operation";
import { observer } from "mobx-react-lite";
import { TextField, Flex, Text } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import operationCSS from "@/components/common/Table/Operations/operation.module.css";
import type { TFlowersOrder } from "../store/FlowersTableStore";

export interface ISearchFilterOptions {
    query: string;
}

export class SearchFilter extends Operation<TFlowersOrder, ISearchFilterOptions> {
    constructor() {
        super("SearchFilter", "Поиск", SearchFilterOptions);

        this.options = {
            query: "",
        };
    }

    override apply() {
        const q = (this.options?.query || "").trim().toLowerCase();
        if (!q) return this.data;

        return this.data.filter((order) => {
            return order.searchIndex.includes(q);
        });
    }
}

export const SearchFilterOptions = observer(
    ({ operation }: { operation: Operation<TFlowersOrder, ISearchFilterOptions> }) => {
        const query = operation.options?.query || "";

        return (
            <Flex align="center" gap="2" className={operationCSS.FlexOptions}>
                <Text size="1" color="gray">
                    Поиск:
                </Text>
                <TextField.Root
                    placeholder="№ заказа, телефон, имя, адрес..."
                    value={query}
                    size="1"
                    style={{ minWidth: 260 }}
                    onChange={(e) => {
                        operation.setOptions({
                            query: e.target.value,
                        });
                    }}
                >
                    <TextField.Slot>
                        <MagnifyingGlassIcon height="14" width="14" />
                    </TextField.Slot>
                </TextField.Root>
            </Flex>
        );
    }
);

export default SearchFilter;
