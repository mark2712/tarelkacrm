"use client";

import { observer } from "mobx-react-lite";
import { googleStoreApi } from "@/components/google/store/GoogleStoreApi";
import { DataLoader } from "@/components/DataLoader";

// import Table from "@/components/Table";
// import tableData from "./columns";


const GoogleTable = observer(() => {
    return (
        <>
            {/* <Table table={tableData} /> */}
            <DataLoader store={googleStoreApi.contacts} autoLoad={true} />
        </>
    );
});

export default GoogleTable;