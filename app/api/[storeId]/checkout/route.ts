import Stripe from "stripe";

import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { connect } from "http2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();
  if (!productIds || productIds.length === 0) {
    console.log("🚀 ~ file: route.ts:25 ~ productIds:", productIds);
    return new NextResponse("productIDs are required", { status: 400 });
  }
  const products = await prismadb.product.findMany({
    where: { id: { in: productIds } },
  });
  console.log("🚀 ~ file: checkout/route.ts:30 ~ products:", products);
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  // Determine the success or failure status and set the query parameter accordingly
  const queryParams = order ? "?success=1" : "?canceled=1";
  const redirectUrl = `${process.env.FRONTEND_STORE_URL}/cart${queryParams}`;

  return NextResponse.json({ url: redirectUrl }, { headers: corsHeaders });
}
