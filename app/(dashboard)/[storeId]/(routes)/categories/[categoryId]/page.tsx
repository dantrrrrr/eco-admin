("");
import prismadb from "@/lib/prismadb";
import React from "react";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await prismadb.category.findUnique({
    where: { id: params.categoryId },
  });
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
  });
  console.log("🚀 ~ file: [categoryId]/page.tsx:14 ~ category:", category);
  return (
    <div className="flex-col">
      <div className="flex-1 space-4 p-8">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
