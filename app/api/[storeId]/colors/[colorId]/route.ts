import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId)
      return new NextResponse("Color ID is required", { status: 400 });

    const color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_GET error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!value)
      return new NextResponse("COLOR value is required", { status: 400 });

    if (!params.colorId)
      return new NextResponse("colorId ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 }); //login but not have access
    }

    const color = await prismadb.color.updateMany({
      where: { id: params.colorId },
      data: { name, value },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_PATCH error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.colorId)
      return new NextResponse("COLOR ID is required", { status: 400 });

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

    const color = await prismadb.color.deleteMany({
      where: { id: params.colorId },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_DELETE error", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
