// import TransferTable from "@/components/transfer/TransferTable";

// export default function Page() {
//   return (
//     <div>
//       <TransferTable />
//     </div>
//   );
// }



"use client";
import dynamic from 'next/dynamic';


const TransferTable = dynamic(() => import('@/components/transfer/TransferTable'), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <TransferTable />
    </>
  );
}

