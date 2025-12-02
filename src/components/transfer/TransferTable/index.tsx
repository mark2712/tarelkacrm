"use client";

import { observer } from "mobx-react-lite";
import { useSearchParams } from "next/navigation";

import { DataLoader } from "@/components/common/DataLoader";
import { transferStoreApi } from "@/components/transfer/store/TransferStoreApi";

import Table from "@/components/common/Table";
import tableData from "./columns";
import Operations from "@/components/common/Table/Operations";
import transferOperationStore from "@/components/transfer/store/TransferTableStore";


const GoogleTable = observer(() => {
    const searchParams = useSearchParams();
    const autoLoad = searchParams.get('autoLoad') !== 'false'; // true по умолчанию

    return (
        <>
            <DataLoader store={transferStoreApi} autoLoad={autoLoad} />
            <Operations operations={transferOperationStore.operations} />
            <Table table={tableData} />
        </>
    );
});

export default GoogleTable;