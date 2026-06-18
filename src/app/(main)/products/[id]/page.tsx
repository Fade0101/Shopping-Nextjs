import { notFound } from "next/navigation";

async function getProduct(id: string) {
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>{product.title}</h1>

      <p>{product.description}</p>

      <h2>${product.price}</h2>
    </div>
  );
}
