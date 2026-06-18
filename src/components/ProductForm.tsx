// components/ProductForm.tsx
import { useEffect, useState } from "react";

interface ProductFormProps {
  initialData?: {
    _id: string;
    title: string;
    description: string;
    price: number;
  };
  onSuccess: () => void;
}

export default function ProductForm({
  initialData,
  onSuccess,
}: ProductFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // Synchronize inputs whenever initialData changes (when user clicks an edit button)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPrice(initialData.price.toString());
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { title, description, price: Number(price) };

    try {
      // Dynamic endpoint selection logic
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Operation failed");

      // Reset form fields if creating a new one
      if (!initialData) {
        setTitle("");
        setDescription("");
        setPrice("");
      }

      onSuccess(); // Triggers page refresh in the parent container
    } catch (err) {
      alert("Error saving data to database!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px",
      }}
    >
      <input
        type="text"
        placeholder="Product Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price ($)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading
          ? "Processing..."
          : initialData
            ? "Update Product Details"
            : "Save Brand New Product"}
      </button>
    </form>
  );
}
