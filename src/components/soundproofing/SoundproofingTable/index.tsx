"use client";

import { observer } from "mobx-react-lite";
import { useSearchParams } from "next/navigation";

import { DataLoader } from "@/components/common/DataLoader";
import { soundproofingStoreApi } from "@/components/soundproofing/store/SoundproofingStoreApi";

import Table from "@/components/common/Table";
import tableData from "./columns";
import Operations from "@/components/common/Table/Operations";
import soundproofingTableStore from "@/components/soundproofing/store/SoundproofingTableStore";


const SoundproofingTable = observer(() => {
    const searchParams = useSearchParams();
    const autoLoad = searchParams.get('autoLoad') !== 'false';

    return (
        <>
            <DataLoader store={soundproofingStoreApi} autoLoad={autoLoad} />
            <Operations operations={soundproofingTableStore.operations} />
            <Table table={tableData} />
        </>
    );
});

export default SoundproofingTable;
