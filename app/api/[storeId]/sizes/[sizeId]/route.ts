import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId)
      return new NextResponse("SIZE ID is required", { status: 400 });

    const size = await prismadb.size.findUnique({
      where: { id: params.sizeId },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("SIZE_GET error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!value)
      return new NextResponse("Size value is required", { status: 400 });

    if (!params.sizeId)
      return new NextResponse("sizeId ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 }); //login but not have access
    }

    const size = await prismadb.size.updateMany({
      where: { id: params.sizeId },
      data: { name, value },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("size_PATCH error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.sizeId)
      return new NextResponse("size ID is required", { status: 400 });

    // FIND THE STORE BELONG TO THE USER(auth())
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      // If no store is found matching the conditions
      return new NextResponse("Unauthorized", { status: 403 });
      // Return a response indicating "Unauthorized" with a status code of 403
    }

    const size = await prismadb.size.deleteMany({
      where: { id: params.sizeId },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("SIZE_DELTE error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
