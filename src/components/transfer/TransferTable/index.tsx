"use client";

import { observer } from "mobx-react-lite";
import Table from "@/components/Table";
import tableData from "./columns";


const GoogleTable = observer(() => {
    return (
        <Table table={tableData} />
    );
});

export default GoogleTable;