// pages/quotes.tsx
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface Quote {
  quote: string;
  author: string;
}

interface Props {
  quotes: Quote[];
}

export default function QuotesPage({ quotes }: Props) {
  useEffect(() => {
    if (!quotes || quotes.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];

      toast(`"${randomQuote.quote}" \n— ${randomQuote.author}`, {
        duration: 4000,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daily Quotes</h1>

      {(!quotes || quotes.length === 0) && (
        <p>No quotes available right now.</p>
      )}

      {quotes?.map((quote, index) => (
        <div
          key={index}
          style={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          <p>"{quote.quote}"</p>
          <p>
            <strong>- {quote.author}</strong>
          </p>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch("https://dummyjson.com/quotes");

    if (!res.ok) {
      throw new Error("Failed to fetch quotes");
    }

    const data = await res.json();

    return {
      props: {
        quotes: data.quotes || [],
      },
    };
  } catch (error) {
    console.error("Error fetching quotes:", error);

    return {
      props: {
        quotes: [],
      },
    };
  }
};
