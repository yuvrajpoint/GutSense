import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "GutSense",
  description: "Gut health guidance using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          // z-index works only if position is set
          zIndex: 99999,
        }}
        className="bg-gray-50 text-gray-800"
      >
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
