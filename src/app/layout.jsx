import "./globals.css";

export const metadata = {
  title: "Inventory Reservation System",
  description: "Multi warehouse reservation platform"
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="bg-[#0b1020] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}