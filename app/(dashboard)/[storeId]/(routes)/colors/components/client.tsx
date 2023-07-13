"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ColorsClientProps {
  data: ColorColumn[];
}

export const ColorsClient = ({ data }: ColorsClientProps) => {
  const router = useRouter();
  const params = useParams();

  // console.log("🚀 ~ file: client.tsx:13 ~ ColorsClient ~ params:", params)
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage Colors for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/colors/new`);
          }}
        >
          <Plus className="mr-2  h-4 w-4 text-white">Add new</Plus>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API call for colors" />
      <Separator />
      <ApiList entityIdName="colorId" entityName="colors" />
    </>
  );
};
