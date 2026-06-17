import Link from "next/link";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
      }}
    >
      <img src={product.thumbnail} alt={product.title} width={150} />

      <h3>{product.title}</h3>

      <p>${product.price}</p>

      <p>⭐ {product.rating}</p>

      <Link
        style={{ textDecoration: "underline", color: "blue" }}
        href={`/products/${product.id}`}
      >
        View Details
      </Link>
    </div>
  );
}
