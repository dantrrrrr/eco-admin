""
import prismadb from "@/lib/prismadb";
import React from "react";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  });
  console.log("🚀 ~ file: [billboardId]/page.tsx:14 ~ billboard:", billboard)
  return (
    <div className="flex-col">
      <div className="flex-1 space-4 p-8">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
