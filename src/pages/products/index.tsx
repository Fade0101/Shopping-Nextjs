// pages/products/index.tsx
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import connectDB from "@/lib/db";
import { Product } from "@/lib/models/Product";
import ProductForm from "@/components/ProductForm";
import { useState } from "react";
import { useRouter } from "next/router";

interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
}

interface Props {
  products: ProductType[];
  isLoggedIn: boolean;
}

export default function ProductsPage({ products, isLoggedIn }: Props) {
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.replace(router.asPath); // Refresh server side data
      } else {
        alert("Delete failed!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Management</h1>

      {/* 1. HIDE POST/PUT FORM IF NO SESSION */}
      {isLoggedIn && (
        <section
          style={{
            marginBottom: "30px",
            border: "1px solid #ccc",
            padding: "15px",
          }}
        >
          <h2>{editingProduct ? "Edit Product" : "Create New Product"}</h2>

          {/* Shared component for both Post and Put */}
          <ProductForm
            initialData={editingProduct || undefined}
            onSuccess={() => {
              setEditingProduct(null); // Clear form state
              router.replace(router.asPath); // Refresh items list
            }}
          />
          {editingProduct && (
            <button onClick={() => setEditingProduct(null)}>Cancel Edit</button>
          )}
        </section>
      )}

      {/* 2. PRODUCTS DISPLAY MATRIX */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>
              <strong>${product.price}</strong>
            </p>

            {/* 3. HIDE PUT & DELETE BUTTONS IF NO SESSION */}
            {isLoggedIn && (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => setEditingProduct(product)}>Edit</button>
                <button
                  onClick={() => handleDelete(product._id)}
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conditional message for anonymous guests */}
      {!isLoggedIn && (
        <p style={{ marginTop: "20px", color: "#666", fontStyle: "italic" }}>
          Showing limited preview of 3 products. Please log in to view our full
          catalog and manage products.
        </p>
      )}
    </div>
  );
}

// THE SERVER-SIDE GUARD
export const getServerSideProps: GetServerSideProps = async (context) => {
  await connectDB();

  // Fetch the session securely on the server
  const session = await getServerSession(context.req, context.res, authOptions);
  const isLoggedIn = !!session;

  // Business Logic Rule: Limit to 3 if no session, fetch all (0 means no limit) if logged in
  const queryLimit = isLoggedIn ? 0 : 3;

  const rawProducts = await Product.find({}).limit(queryLimit).lean();

  // Clean the data: Convert MongoDB ObjectIDs to plain strings for serialization safely
  const products = rawProducts.map((doc: any) => ({
    ...doc,
    _id: doc._id.toString(),
  }));

  return {
    props: {
      products,
      isLoggedIn,
    },
  };
};
