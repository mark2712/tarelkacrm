"use client";

import { observer } from "mobx-react-lite";
import { useSearchParams } from "next/navigation";

import { DataLoader } from "@/components/common/DataLoader";
import { flowersStoreApi } from "@/components/flowerskursk/store/FlowersStoreApi";

import Table from "@/components/common/Table";
import tableData from "./columns";
import Operations from "@/components/common/Table/Operations";
import flowersTableStore from "@/components/flowerskursk/store/FlowersTableStore";

const FlowersTable = observer(() => {
    const searchParams = useSearchParams();
    const autoLoad = searchParams.get("autoLoad") !== "false";

    return (
        <>
            <DataLoader store={flowersStoreApi} autoLoad={autoLoad} label="Загружено заказов" />
            <Operations operations={flowersTableStore.operations} />
            <Table table={tableData} />
        </>
    );
});

export default FlowersTable;
