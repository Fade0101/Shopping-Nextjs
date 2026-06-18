import { NextResponse } from "next/server";

import Product from "../../models/Product";
import { connectDB } from "../../lib/db";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();

    return NextResponse.json(products);
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        message: "Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      },
    );
  }
}
