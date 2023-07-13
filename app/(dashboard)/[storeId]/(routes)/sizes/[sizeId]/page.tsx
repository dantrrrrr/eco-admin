""
import prismadb from "@/lib/prismadb";
import React from "react";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
  params,
}: {
  params: { sizeId: string };
}) => {
  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId },
  });
  console.log("🚀 ~ file: [SizeId]/page.tsx:14 ~ Size:", size)
  return (
    <div className="flex-col">
      <div className="flex-1 space-4 p-8">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
