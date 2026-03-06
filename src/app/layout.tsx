import React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QueryEase - Transform Your Query Management Experience",
  description: "Streamline your query management for modern frameworks.",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Toaster />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default Layout;