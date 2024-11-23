"use client";

// import Main from "@/components/Main";
import dynamic from "next/dynamic";

const DynamicMain = dynamic(() => import("@/components/Main"), {
  ssr: false,
});

export default function DynamicWrapper() {
  return <DynamicMain />;
  // return <Main />;
}
