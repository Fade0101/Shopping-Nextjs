import { GetStaticProps } from "next";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { useDeferredValue, useMemo, useState, useTransition } from "react";

interface Props {
  products: Product[];
}

export default function ProductsPage({ products }: Props) {
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("");

  const [isPending, startTransition] = useTransition();

  const deferredSearch = useDeferredValue(search);
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) =>
      product.title.toLowerCase().includes(deferredSearch.toLowerCase()),
    );

    if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, deferredSearch, sortBy]);
  return (
    <div>
      <h1>Products</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => startTransition(() => setSearch(e.target.value))}
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Default</option>

        <option value="price">Price</option>

        <option value="rating">Rating</option>
      </select>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("https://dummyjson.com/products");

  const data = await res.json();

  return {
    props: {
      products: data.products,
    },

    revalidate: 60,
  };
};
