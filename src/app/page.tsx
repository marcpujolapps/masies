"use client";

import dynamic from "next/dynamic";

const DynamicMain = dynamic(() => import("@/components/Main"), {
  ssr: false,
});

export default function DynamicWrapper() {
  return <DynamicMain />;
}
