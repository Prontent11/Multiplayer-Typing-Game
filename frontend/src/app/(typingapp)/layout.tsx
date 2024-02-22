"use client";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContestProvider } from "../context/ContestContext";

const inter = Inter({ subsets: ["latin"] });

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen justify-center">
      <ContestProvider>
        <Navbar></Navbar>
        <div className="">{children}</div>
        <Footer></Footer>
      </ContestProvider>
    </div>
  );
}
