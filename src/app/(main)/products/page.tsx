import Link from "next/link";

async function getProducts() {
  const response = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  return response.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Products</h1>

      {products.map((product: any) => (
        <div key={product._id}>
          <h3>{product.title}</h3>

          <p>${product.price}</p>

          <Link href={`/products/${product._id}`}>Details</Link>
        </div>
      ))}
    </div>
  );
}
