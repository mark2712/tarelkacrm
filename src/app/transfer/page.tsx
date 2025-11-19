"use client";
// import styles from "./page.module.css";
import { DataLoader } from "@/components/DataLoader";
import Operations from "@/components/Table/Operations";
import TransferTable from "@/components/transfer/TransferTable";
import transferOperationStore from "@/components/transfer/store/TransferOperationStore";
import { transferStoreApi } from "@/components/transfer/store/TransferStoreApi";


export default function Home() {
  return (
    <>
      <DataLoader store={transferStoreApi.leads} autoLoad={true} />
      <Operations operations={transferOperationStore.operations} />
      <TransferTable />
    </>
  );
}
