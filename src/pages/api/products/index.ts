import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/lib/db";
import { Product } from "@/lib/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);

  switch (req.method) {
    case "GET":
      try {
        const limit = session ? 0 : 3;
        const products = await Product.find({}).limit(limit);

        return res.status(200).json({ success: true, data: products });
      } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error" });
      }

    case "POST":
      try {
        if (!session) {
          return res
            .status(401)
            .json({ success: false, error: "Unauthorized" });
        }

        const newProduct = await Product.create(req.body);
        return res.status(201).json({ success: true, data: newProduct });
      } catch (error) {
        return res.status(400).json({ success: false, error: "Bad Request" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
