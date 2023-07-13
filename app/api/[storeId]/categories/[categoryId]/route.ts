import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const category = await prismadb.category.findUnique({
      where: { id: params.categoryId },
      include: {
        billboard: true,
      },
    });
    // console.log(JSON.stringify(req.url));
    return NextResponse.json(category);
  } catch (error) {
    console.log("Category_GET error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    if (!params.categoryId)
      return new NextResponse("category ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 }); //login but not have access
    }

    const category = await prismadb.category.updateMany({
      where: { id: params.categoryId },
      data: { name, billboardId },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("BILLBOARD_PATCH error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 }); //login but not have access
    }
    const category = await prismadb.category.deleteMany({
      where: { id: params.categoryId },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("BILLBOARD_DELTE error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
