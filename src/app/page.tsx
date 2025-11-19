"use client";
// import styles from "./page.module.css";
import { googleStoreApi } from "@/components/google/store/GoogleStoreApi";
import { DataLoader } from "@/components/DataLoader";
import GoogleTable from "@/components/google/GoogleTable";


export default function Home() {
  return (
    <>
      <DataLoader store={googleStoreApi.contacts} autoLoad={true} />
      <GoogleTable />
    </>
  );
}
