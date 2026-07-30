import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brain Tumor Classification · VGG19 Transfer Learning",
  description:
    "An immersive 3D visual case study of fine-tuning VGG19 on 7,023 MRI scans for 4-class brain tumor diagnosis — reaching 94.75% validation accuracy and 99.11% AUC.",
  keywords: [
    "Brain Tumor",
    "VGG19",
    "Transfer Learning",
    "MRI",
    "Deep Learning",
    "CNN",
    "Medical AI",
    "TensorFlow",
  ],
  authors: [{ name: "Clinical ML Lab" }],
  openGraph: {
    title: "Brain Tumor Classification · VGG19 Transfer Learning",
    description:
      "Fine-tuning VGG19 on 7,023 MRI scans for 4-class brain tumor diagnosis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
