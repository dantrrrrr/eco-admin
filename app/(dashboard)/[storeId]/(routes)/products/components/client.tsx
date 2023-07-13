"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient = ({ data }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();

  // console.log("🚀 ~ file: client.tsx:13 ~ ProductClient ~ params:", params)
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/products/new`);
          }}
        >
          <Plus className="mr-2  h-4 w-4 text-white">Add new</Plus>
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API call for products" />
      <Separator />
      <ApiList entityIdName="productId" entityName="products" />
    </>
  );
};
