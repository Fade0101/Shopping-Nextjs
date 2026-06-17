// src/lib/api.ts

const BASE_URL = "https://dummyjson.com";

export async function getProducts() {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}
export async function getProductById(id: string) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();
}
