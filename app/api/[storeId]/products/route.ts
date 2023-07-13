import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isArchived,
      isFeatured,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 }); //not login
    }
    if (!images || !images.length) {
      return new NextResponse("Images is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("price  is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("categoryId  is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("colorId  is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("sizeId  is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }
    //find store by user belong to
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 }); //login but not have access
    }
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
//get all billboards
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: { createdAt: "desc" },
    });
    // console.log(req.url)
    
    // console.log("🚀 ~ file: route.ts:118 ~ products:", products)
    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
