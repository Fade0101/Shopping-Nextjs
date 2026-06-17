// pages/_app.tsx
import Navbar from "@/components/Navbar";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Toaster position="bottom-right" />

      <Component {...pageProps} />
    </>
  );
}
