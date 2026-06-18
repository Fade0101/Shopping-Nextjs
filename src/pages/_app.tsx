import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Toaster position="bottom-right" />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
