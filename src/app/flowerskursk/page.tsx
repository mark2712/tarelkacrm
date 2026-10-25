"use client";

import dynamic from "next/dynamic";

const FlowersTable = dynamic(() => import("@/components/flowerskursk/FlowersTable"), {
  ssr: false,
});

export default function FlowersKurskPage() {
  return (
    <>
      <FlowersTable />
    </>
  );
}
