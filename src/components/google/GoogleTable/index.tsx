"use client";

import { observer } from "mobx-react-lite";
import { DataLoader } from "@/components/common/DataLoader";
import { googleStoreApi } from "@/components/google/store/GoogleStoreApi";
import Table from "@/components/common/Table";
import tableData from "./columns";
import Operations from "@/components/common/Table/Operations";
import { googleTableStore } from "../store/GoogleTableStore";


const GoogleTable = observer(() => {
    return (
        <>
            <DataLoader store={googleStoreApi} autoLoad={true} />
            <Operations operations={googleTableStore.operations} />
            <Table table={tableData} />
        </>
    );
});

export default GoogleTable;