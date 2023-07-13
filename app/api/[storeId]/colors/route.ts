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
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 }); //not login
    }

    if (!name) {
      return new NextResponse("Name size is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value size is required", { status: 400 });
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
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
//get all billboards
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
