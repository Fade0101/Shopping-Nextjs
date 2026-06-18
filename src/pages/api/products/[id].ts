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

  // Security: Block all access to PUT/DELETE if not logged in
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  // Extract the ID from the URL (/api/products/[id])
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true, // Returns the updated document instead of the old one
          runValidators: true,
        });

        if (!updatedProduct) {
          return res
            .status(404)
            .json({ success: false, error: "Product not found" });
        }

        return res.status(200).json({ success: true, data: updatedProduct });
      } catch (error) {
        return res.status(400).json({ success: false, error: "Update failed" });
      }

    case "DELETE":
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          return res
            .status(404)
            .json({ success: false, error: "Product not found" });
        }

        return res.status(200).json({ success: true, data: {} });
      } catch (error) {
        return res.status(400).json({ success: false, error: "Delete failed" });
      }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
