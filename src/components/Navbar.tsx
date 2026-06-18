import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "2px solid #ddd",
      }}
    >
      <div style={{ display: "flex", gap: "20px", fontWeight: "bold" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#333" }}>
          Home
        </Link>
        <Link
          href="/products"
          style={{ textDecoration: "none", color: "#0070f3" }}
        >
          Products
        </Link>
        <Link href="/quotes" style={{ textDecoration: "none", color: "#333" }}>
          Quotes
        </Link>
      </div>

      <div>
        {session ? (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "14px", color: "#555" }}>
              Welcome, {session.user?.name || "User"}!
            </span>
            <button
              onClick={() => signOut()}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              backgroundColor: "#000",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Log In
          </button>
        )}
      </div>
    </nav>
  );
}
