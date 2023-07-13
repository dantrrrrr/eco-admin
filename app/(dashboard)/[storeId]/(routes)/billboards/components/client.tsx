"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardsClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();

  // console.log("🚀 ~ file: client.tsx:13 ~ BillboardsClient ~ params:", params)
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/billboards/new`);
          }}
        >
          <Plus className="mr-2  h-4 w-4 text-white">Add new</Plus>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API call for billboards" />
      <Separator />
      <ApiList entityIdName="billboardsId" entityName="billboards" />
    </>
  );
};
