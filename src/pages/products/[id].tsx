import { GetStaticPaths, GetStaticProps } from "next";

import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductPage({ product }: Props) {
  return (
    <div>
      <h1>{product.title}</h1>

      <img src={product.thumbnail} alt={product.title} width={300} />

      <p>{product.description}</p>

      <p>${product.price}</p>

      <p>⭐ {product.rating}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch("https://dummyjson.com/products");

  const data = await res.json();

  const paths = data.products.map((product: Product) => ({
    params: {
      id: product.id.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`https://dummyjson.com/products/${params?.id}`);

  const product = await res.json();

  return {
    props: {
      product,
    },

    revalidate: 60,
  };
};
