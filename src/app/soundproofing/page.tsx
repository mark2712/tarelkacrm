"use client";

import dynamic from 'next/dynamic';

const SoundproofingTable = dynamic(() => import('@/components/soundproofing/SoundproofingTable'), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <SoundproofingTable />
    </>
  );
}
