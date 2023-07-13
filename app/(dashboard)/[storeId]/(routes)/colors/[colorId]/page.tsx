("");
import prismadb from "@/lib/prismadb";
import React from "react";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId },
  });
  console.log("🚀 ~ file: [colorId]/page.tsx:14 ~ color:", color);
  return (
    <div className="flex-col">
      <div className="flex-1 space-4 p-8">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
