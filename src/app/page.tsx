"use client";
import dynamic from 'next/dynamic';


const GoogleTable = dynamic(() => import('@/components/google/GoogleTable'), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <GoogleTable />
    </>
  );
}

