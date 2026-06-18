import { NextResponse } from "next/server";

import Product from "../../../models/Product";
import { connectDB } from "../../../lib/db";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          message: "Product Not Found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
