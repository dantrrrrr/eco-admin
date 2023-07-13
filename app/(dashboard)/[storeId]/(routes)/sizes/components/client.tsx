"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface SizesClientProps {
  data: SizeColumn[];
}

export const SizesClient = ({ data }: SizesClientProps) => {
  const router = useRouter();
  const params = useParams();

  // console.log("🚀 ~ file: client.tsx:13 ~ SizesClient ~ params:", params)
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage Sizes for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/sizes/new`);
          }}
        >
          <Plus className="mr-2  h-4 w-4 text-white">Add new</Plus>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API call for sizes" />
      <Separator />
      <ApiList entityIdName="sizeId" entityName="sizes" />
    </>
  );
};
