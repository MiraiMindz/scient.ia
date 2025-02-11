import type { Metadata } from "next";
import { Geist, Geist_Mono, Arvo, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const arvo = Arvo({
    weight: ["400", "700"],
    style: ["italic", "normal"],
    subsets: ["latin"],
    variable: "--font-arvo",
});

const playfairDisplay = Playfair_Display({
    weight: "variable",
    style: ["italic", "normal"],
    subsets: ["latin", "latin-ext"],
    variable: "--font-playfairDisplay",
});

export const metadata: Metadata = {
    title: "Scient.ia",
    description: "Aprenda a criar ciência",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${arvo.variable} ${playfairDisplay.variable} antialiased w-screen h-screen scroll-smooth`}
            >
                {children}
            </body>
        </html>
    );
}
