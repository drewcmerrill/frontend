"use client";
import { Calculator } from "@/components/Calculator";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 overflow-x-hidden ">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <TextGenerateEffect
          className="text-8xl font-semibold"
          words={"Krypto"}
          duration={2}
        />
        <Calculator />
      </main>
    </div>
  );
}
