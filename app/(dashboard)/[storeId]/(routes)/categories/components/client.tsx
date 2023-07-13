"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoryClient = ({ data }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  // console.log("🚀 ~ file: client.tsx:13 ~ CategoryClient ~ params:", params)
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/categories/new`);
          }}
        >
          <Plus className="mr-2  h-4 w-4 text-white">Add new</Plus>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API call for categories" />
      <Separator />
      <ApiList entityIdName="categoriesId" entityName="categories" />
    </>
  );
};
